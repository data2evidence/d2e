import { env } from '../env';
import { getCachedbDbConnections } from './cachedb'
import { ConnectionInterface } from '@alp/alp-base-utils/target/src/Connection';

const schemaPath = env.FHIR_SCHEMA_PATH + '/' + env.FHIR_SCHEMA_FILE_NAME 

export async function createResourceInFhir(data){
    let datasetId = data.meta.id
    console.info(`DatasetId: ${datasetId}`)
    let conn = await getCachedbDbConnections(datasetId)
    console.info(conn)
    try{
        return new Promise((resolve, reject) => {
            conn.executeQuery(`select * from read_json('${schemaPath}')`, [], async (err: any, result: any) => {
                if(err){
                    console.log('Error loading fhir schema json: '+ JSON.stringify(err))
                    reject(err)
                }
                console.info(result)
                const parsedFhirDefinitions = getFhirTableStructure(result[0], data.resourceType)
                const insertStatement = getInsertStatement(data, parsedFhirDefinitions)
                insertIntoFhirTable(conn, data.resourceType, insertStatement, (err, result) =>{
                    if(err){
                        console.log(err)
                        reject(err)
                    }
                    console.log(JSON.stringify('Insert result: ' + JSON.stringify(result)))
                    console.log('Data inserted into FHIR data model')
                    resolve(true)
                })
            })
        })
    }catch(err){
        console.error(err)
    }finally{
        conn.close()
    }
}

function getInsertStatement(data, parsedFhirDefinitions){
    let resourceProperties: string[] = []
    let parsedData = {}
    let abc = {}
    for(const property in parsedFhirDefinitions){
        parsedData[property] = parsedFhirDefinitions[property]
        resourceProperties.push(property)
        abc[property] = parsedFhirDefinitions[property]
        if(data[property] == undefined){
            if(parsedFhirDefinitions[property] == 'boolean')
                parsedData[property] = 'false'
            else if(parsedFhirDefinitions[property] == 'number')
                parsedData[property] = 0
            else
                parsedData[property] = 'Null'
        }
        else 
            parsedData[property] = data[property]
    }
    let cols = customMerge(abc, parsedData)
    let colValues = getDuckdbInsertColumValues(cols)
    return colValues
}

function customMerge(obj1, obj2) {
    let merged = { ...obj1 };
    //Parse incoming data to duckdb fhir resource table and set default value for all unassigned variables to Null
    for(let key in obj1){
        if(typeof obj1[key] == 'object' && key.substring(0, 1) == "_"){
            merged[key] = obj2 == undefined || !obj2.hasOwnProperty(key)
                        ? 'Null'
                        : obj2[key]
        }
        else if(typeof obj1[key] == 'object' && obj1[key].length > 0){
            if(obj1[key][0] == 'string' || obj1[key][0] == 'json')
                merged[key] = obj2[key] && obj2[key] !== 'Null'? obj2[key]: ['']
            else{
                merged[key] = []
                if(obj2 !== null && obj2[key] !== undefined && obj2[key] !== 'Null' && obj2[key] !== null && obj2[key].length > 0){
                    for(let i=0; i<obj2[key].length; i++){
                        merged[key].push(customMerge(obj1[key][0], obj2[key][i]))
                    }
                }else{
                    merged[key].push(customMerge(obj1[key][0], {}))
                }  
            }
        }
        else if(typeof obj1[key] == 'object'){
            if(Object.keys(obj1[key]).length == 0)
                merged[key] = "Null"
            else
                merged[key] = customMerge(obj1[key], obj2[key] == undefined? {}: obj2[key])
        }else
            merged[key] = obj2 == undefined || !obj2.hasOwnProperty(key) || obj2[key] == null
                                ? obj1[key] == 'boolean'? 'false': obj1[key] == 'number'? 0: 'Null'
                                : obj2[key]
    }
    return merged
}

function getDuckdbInsertColumValues(data){
    let insertColNames : string[] = []
    let insertColValues : string[] = []
    for(const property in data){
        insertColNames.push(property)
        if(property.substring(0, 1) == "_"){
            let temp = data[property] == 'Null'? 'Null' : `'${JSON.stringify(data[property])}'`
            insertColValues.push(`${temp}`)
        }
        else if(property == 'meta' || property == 'extension' || property == 'contained'){
            let temp = data[property] == 'Null'? 'Null' : `'${JSON.stringify(data[property])}'`
            insertColValues.push(`${temp}`)
        }
        else if(typeof data[property] == 'object' && data[property].length > 0){
            insertColValues.push(`${getDuckdbArrayColValue(data[property])}`) 
        }
        else if(typeof data[property] == 'object' && Object.prototype.toString.call(data[property]) !== '[object Date]'){
            insertColValues.push(getDuckdbStructColValue('', data[property])) 
        }
        else{
            let temp = data[property] == 'Null'? 'Null' : `'${data[property]}'`
            insertColValues.push(`${temp}`)
        }
    }
    return `(${insertColNames.join(',')})VALUES(${insertColValues.join(',')})`
}

function getDuckdbArrayColValue(data){
    let arrayValues : string[] = []
    let colType = '['
    for(let i = 0; i< data.length; i++){
        if((typeof data[i] == 'object' || typeof data[i] == 'string') && data.length == 1){
            if(typeof data[i] == 'string'){
                arrayValues.push(`'${data[i]}'`)
            }else{
                arrayValues.push(getDuckdbStructColValue('', data[i]))
            }
        }
        else if(typeof data[i] == 'object' && data[i].length > 0){
                arrayValues.push(getDuckdbArrayColValue(data[i]))
        }else if(typeof data[i] == 'object')
            arrayValues.push(getDuckdbStructColValue('', data[i]))
        else{
            let temp = data[i] == 'Null'? 'Null' : `'${data[i]}'`
            arrayValues.push(`${temp}`)
        }
    }    
    return `${colType + arrayValues.join(',')}]`
}

function getDuckdbStructColValue(colProperty, structDataType){
    let colValues : string[] = []
    for(const property in structDataType){
        if(property.substring(0, 1) == "_"){
            let temp = structDataType[property] == 'Null'? 'Null' : `'${JSON.stringify(structDataType[property])}'`
            colValues.push(`"${property}" := ${temp}`)
        }
        else if(property == 'meta' || property == 'extension' || property == 'contained'){
            let temp = structDataType[property] == 'Null'? 'Null' : `'${JSON.stringify(structDataType[property])}'`
            colValues.push(`"${property}" := ${temp}`)
        }
        else if(structDataType[property] && typeof structDataType[property] == 'object' && structDataType[property].length > 0){
            colValues.push(`"${property}" := ${getDuckdbArrayColValue(structDataType[property])}`)
        }else if(typeof structDataType[property] == 'object' && Object.prototype.toString.call(structDataType[property]) !== '[object Date]' && structDataType[property] !== null)
            colValues.push(getDuckdbStructColValue(property, structDataType[property]))
        else{
            let temp = structDataType[property] == 'Null'? 'Null' : `'${structDataType[property]}'`
            colValues.push(`"${property}" := ${temp}`)
        }
            
    }
    return colProperty == ''
            ? `struct_pack(${colValues.join(',')})`
            : `"${colProperty}" := struct_pack(${colValues.join(',')})`
}

export function getFhirTableStructure(jsonSchema, fhirDefinitionName){
    try{
        let fhirDefinition = jsonSchema.definitions[fhirDefinitionName]
        fhirDefinition.parsedProperties = {}
        if(isResource(jsonSchema, fhirDefinitionName)){
            if(fhirDefinition.properties !== undefined){
                for (const property in fhirDefinition.properties) {
                    if(property.substring(0, 1) != "_"){
                        const properyPath = getPropertyPath(fhirDefinition.properties[property])
                        if(isCustomType(properyPath)){
                            fhirDefinition.parsedProperties[property] = ['string']
                        }else if(properyPath == 'Meta' || properyPath == 'Extension'|| properyPath == 'ResourceList'){
                            fhirDefinition.parsedProperties[property] = 'json'
                        }
                        else
                            fhirDefinition.parsedProperties[property] = getNestedProperty(jsonSchema, properyPath, fhirDefinition.properties[property], properyPath)
                    }
                }
                return fhirDefinition.parsedProperties
            }else{
                return `The input FHIR resource ${fhirDefinition} has no properties defined`
            }
        }else{
            return `The input resource ${fhirDefinition} is not a FHIR resource`
        }
    }catch(error){
        console.log(`Error while creating duckdb table for resource : ${fhirDefinitionName}`)
        throw error
    }
}

function getNestedProperty(jsonschema, propertyPath, propertyDetails, heirarchy){
    if(propertyDetails.$ref != undefined){
        if(propertyPath !== undefined){
            let subProperties = jsonschema.definitions[propertyPath]
            if(subProperties.properties !== undefined){
                subProperties.parsedProperties = {}
                for (const subProperty in subProperties.properties) {
                    if(subProperty.substring(0, 1) != "_"){
                        const subPropertyDetails = subProperties.properties[subProperty]
                        const subPropertyPath =  getPropertyPath(subPropertyDetails)
                        if(isCustomType(subPropertyPath)){
                            subProperties.parsedProperties[subProperty] = ['string']
                        }else if(subPropertyPath == 'Meta' || subPropertyPath == 'Extension'|| subPropertyPath == 'ResourceList'){
                            subProperties.parsedProperties[subProperty] = 'json'
                        }else{
                            //Check if the property is already covered previously
                            if(heirarchy.indexOf(subPropertyPath) > -1){
                                subProperties.parsedProperties[subProperty] = {}
                            }
                            else{
                                const newHeirarchy = heirarchy + "/" + subPropertyPath
                                subProperties.parsedProperties[subProperty] = getNestedProperty(jsonschema, subPropertyPath, subPropertyDetails, newHeirarchy)
                            }
                        }
                    }
                }
                return subProperties.parsedProperties
            }else{
                return subProperties.type==undefined ? "string" : subProperties.type
            }
        }
    }else if(propertyDetails.type == "array"){
        if(propertyDetails.items.enum !== undefined){
            return ['string']
        }else if(propertyPath !== undefined){
            let subProperties = jsonschema.definitions[propertyPath]
            if(subProperties.properties !== undefined){
                subProperties.parsedProperties = {}
                for (const subProperty in subProperties.properties) {
                    if(subProperty.substring(0, 1) != "_"){
                        const subPropertyDetails = subProperties.properties[subProperty]
                        const subPropertyPath =  getPropertyPath(subPropertyDetails)
                        if(isCustomType(subPropertyPath)){
                            subProperties.parsedProperties[subProperty] = ['string']
                        }else if(subPropertyPath == 'Meta' || subPropertyPath == 'Extension'|| subPropertyPath == 'ResourceList'){
                            subProperties.parsedProperties[subProperty] = 'json'
                        }else{
                            //Check if the property is already covered previously
                            if(heirarchy.indexOf(subPropertyPath) > -1){
                                subProperties.parsedProperties[subProperty] = 'json'
                            }else{
                                const newHeirarchy = heirarchy + "/" + subPropertyPath
                                subProperties.parsedProperties[subProperty] = getNestedProperty(jsonschema, subPropertyPath, subPropertyDetails, newHeirarchy)
                            }   
                        }
                    }
                }
                return [subProperties.parsedProperties]
            }else {
                return subProperties.type == undefined ? ["string"] : [subProperties.type]
            }
        }
    }else if(propertyDetails.enum !== undefined){
        return "string"
    } else if(propertyDetails.const !== undefined){
        return "string"
    }
    else if(propertyDetails.type == undefined){
        return 'string'
    }
    else {
        return propertyDetails.type
    }
}

function isResource(schema, resourceDefinition: any) {
    return schema.discriminator.mapping[resourceDefinition] !== undefined
}

function getPropertyPath(fhirDefinitionProperties){
    return fhirDefinitionProperties.$ref != undefined
            ? fhirDefinitionProperties.$ref.substring(fhirDefinitionProperties.$ref.lastIndexOf("/") + 1, fhirDefinitionProperties.$ref.length)
            : fhirDefinitionProperties.items !== undefined && fhirDefinitionProperties.items.$ref != undefined
            ? fhirDefinitionProperties.items.$ref.substring(fhirDefinitionProperties.items.$ref.lastIndexOf("/") + 1, fhirDefinitionProperties.items.$ref.length)
            : undefined
}

function isCustomType(properyPath){
    if(properyPath == 'ResourceList' || properyPath == 'Resource' || properyPath == 'ProjectSetting' || properyPath == 'ProjectSite' || properyPath == 'ProjectLink' || properyPath == 'ProjectMembershipAccess' || properyPath == 'AccessPolicyResource' || properyPath == 'AccessPolicyIpAccessRule' || properyPath == 'UserConfigurationMenu' || properyPath == 'UserConfigurationSearch'|| properyPath == 'UserConfigurationOption' || properyPath == 'BulkDataExportOutput' || properyPath == 'BulkDataExportDeleted' || properyPath == 'BulkDataExportError' || properyPath == 'AgentSetting' || properyPath == 'AgentChannel' || properyPath == 'ViewDefinitionConstant' || properyPath == 'ViewDefinitionSelect' || properyPath == 'ViewDefinitionWhere')
        return true 
}

async function insertIntoFhirTable(conn: ConnectionInterface, fhirResource, insertStatement, callback){
    conn.executeQuery(`INSERT INTO ${fhirResource}Fhir ${insertStatement}`, [], (err: any, result: any) =>{
         callback(err, result)
     })
 }