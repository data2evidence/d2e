import { DuckdbConnection } from './utils/duckdbUtil'
import { env } from './env'
const schemaPath = `${env.FHIR_SCHEMA_PATH}/${env.FHIR_SCHEMA_FILE_NAME}`

export async function readJsonFileAndCreateDuckdbTables(){
    let duckdb = new DuckdbConnection()
    try{
        await duckdb.createConnection('/home/docker/alp-data-node/app/src/duckdb');
        const result = await duckdb.executeQuery(`select * from read_json('${schemaPath}')`)
        const fhirResources = result[0].discriminator.mapping
        const duckdbDataTypes = convertFhirDataTypesToDuckdb(result[0])
        for(let resource in fhirResources){
            const parsedFhirDefinitions = getFhirTableStructure(result[0], resource)
            const duckdbTableStructure = getDuckdbColumnString(duckdbDataTypes, parsedFhirDefinitions, true)
            await createFhirTable(duckdb, resource, duckdbTableStructure)
            console.log(`Fhir table created for resource ${resource}`)
        }
        console.log('Fhir Table creation successfuly!')
    }catch(err){
        console.log(err)
    }finally{
        duckdb.close()
    }
}

function getFhirTableStructure(jsonSchema, fhirDefinitionName){
    try{
        let fhirDefinition = jsonSchema.definitions[fhirDefinitionName]
        fhirDefinition.parsedProperties = {}
        if(isResource(jsonSchema, fhirDefinitionName)){
            if(fhirDefinition.properties !== undefined){
                for (const property in fhirDefinition.properties) {
                    const properyPath = getPropertyPath(fhirDefinition.properties[property])
                    if(isCustomType(properyPath)){
                        fhirDefinition.parsedProperties[property] = ['string']
                    }else if(properyPath == 'Meta' || properyPath == 'Extension'){
                        fhirDefinition.parsedProperties[property] = 'json'
                    }
                    else
                        fhirDefinition.parsedProperties[property] = getNestedProperty(jsonSchema, properyPath, fhirDefinition.properties[property], properyPath)
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
                        }else if(subPropertyPath == 'Meta' || subPropertyPath == 'Extension'){
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
                        }else if(subPropertyPath == 'Meta' || subPropertyPath == 'Extension'){
                            subProperties.parsedProperties[subProperty] = 'json'
                        }else{
                            //Check if the property is already covered previously
                            if(heirarchy.indexOf(subPropertyPath) > -1){
                                subProperties.parsedProperties[subProperty] = {}
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

function getFhirDataModel(duckdbDataTypes, dataStructure, property){
    if(typeof dataStructure[property] !== "object"){
        return getPropertyForTable(duckdbDataTypes, dataStructure, property)
    }else if(typeof dataStructure[property] == "object"){
        let listOfTableColumns = []
        let isArray = false;
        //Nested extension objects are set as {}
        if(Object.keys(dataStructure[property]).length == 0){
            return getPropertyForTable(duckdbDataTypes, dataStructure, property, duckdbDataTypes['string'])
        }else{
            let currentProperty = dataStructure[property]
            if(currentProperty.length !== undefined && dataStructure[property].length > 0){
                isArray = true
                currentProperty =  dataStructure[property][0]
            }
            //For properties with array of strings
            if(dataStructure[property].length > 0 && duckdbDataTypes[currentProperty] !== undefined){
                return getPropertyForTable(duckdbDataTypes, dataStructure, property, duckdbDataTypes[currentProperty])+'[]'
            }else{
                for(const childProperty in currentProperty){
                    listOfTableColumns.push(getFhirDataModel(duckdbDataTypes, currentProperty, childProperty))
                }
                return getPropertyForTable(duckdbDataTypes, dataStructure, property, getFhirDataModelForObject(listOfTableColumns, isArray))
            }
        }
    }
}

function getPropertyForTable(duckdbDataTypes, dataStructure, property, propertyType?){
    if(propertyType)
        return `"${property}" ${propertyType}`
    else if(duckdbDataTypes[dataStructure[property]] !== undefined)
        return `"${property}" ${duckdbDataTypes[dataStructure[property]]}`
    else if(duckdbDataTypes[dataStructure[property]] == undefined && dataStructure[property] == "json")
        return `"${property}" ${dataStructure[property]}`
    else
        throw `${property} has undefined property type`
}

function getDuckdbColumnString(duckdbDataTypes, dataStructure, concatColumns:boolean){
    let listOfTableColumns = []
    for(const property in dataStructure){
        if(property.indexOf('_') == -1)
            listOfTableColumns.push(getFhirDataModel(duckdbDataTypes, dataStructure, property))
    }
    return concatColumns?listOfTableColumns.join(', '): listOfTableColumns
}

function getFhirDataModelForObject(listOfObjectColumns, isArray){
    return `struct(${listOfObjectColumns.join(', ')})${isArray? '[]': ''}`
}

function getFhirDataTypes(jsonSchema){
    let dataTypes = {}
    for(const definition in jsonSchema.definitions){
        if(jsonSchema.definitions[definition].type !== undefined){
            dataTypes[jsonSchema.definitions[definition].type] = jsonSchema.definitions[definition].type
        }
    }
    return dataTypes
}

function convertFhirDataTypesToDuckdb(jsonSchema){
    let dataTypes = getFhirDataTypes(jsonSchema)
    for(const fhirDataType in dataTypes){
        switch(dataTypes[fhirDataType]){
            case "string": 
                dataTypes[fhirDataType] = "varchar"
                break;
            case "number":
                dataTypes[fhirDataType] = "integer"
                break;
            case "boolean":
                dataTypes[fhirDataType] = "boolean"
                break;
            case "json": 
                dataTypes[fhirDataType] = "json"
                break;
        }
    }
    return dataTypes;
}

function isCustomType(properyPath){
    if(properyPath == 'ResourceList' || properyPath == 'Resource' || properyPath == 'ProjectSetting' || properyPath == 'ProjectSite' || properyPath == 'ProjectLink' || properyPath == 'ProjectMembershipAccess' || properyPath == 'AccessPolicyResource' || properyPath == 'AccessPolicyIpAccessRule' || properyPath == 'UserConfigurationMenu' || properyPath == 'UserConfigurationSearch'|| properyPath == 'UserConfigurationOption' || properyPath == 'BulkDataExportOutput' || properyPath == 'BulkDataExportDeleted' || properyPath == 'BulkDataExportError' || properyPath == 'AgentSetting' || properyPath == 'AgentChannel' || properyPath == 'ViewDefinitionConstant' || properyPath == 'ViewDefinitionSelect' || properyPath == 'ViewDefinitionWhere')
        return true 
}

async function createFhirTable(duckdb, fhirDefinition, fhirTableDefinition){
    try{
        var result = await duckdb.executeQuery(`create or replace table ${fhirDefinition}Fhir (${fhirTableDefinition})`)
    }catch(err){
        console.log(`Error creating table ${fhirDefinition}`)
        throw err
    }
}

readJsonFileAndCreateDuckdbTables()