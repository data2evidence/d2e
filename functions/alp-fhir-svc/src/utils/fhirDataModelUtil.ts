import moment from 'moment'
import { env } from '../env';
import { ConnectionInterface } from '@alp/alp-base-utils/target/src/Connection';
import { QuestionnaireResponse, QuestionnaireResponseItem, QuestionnaireResponseItemAnswer } from '@medplum/fhirtypes';
import { v4 as uuidv4 } from 'npm:uuid'

const schemaPath = env.FHIR_SCHEMA_PATH + '/' + env.FHIR_SCHEMA_FILE_NAME 

export async function getFhirJsonSchema(conn:ConnectionInterface){
    return new Promise((resolve, reject) => {
        conn.executeQuery(`select * from read_json('${schemaPath}')`, [], (err: any, result: any) => {
            if(err){
                console.log('Error loading fhir schema json: '+ JSON.stringify(err))
                reject(err)
            }
            resolve(result[0])
        })
    })
}

//Test
export async function getFhirData(conn:ConnectionInterface, query){
    return new Promise((resolve, reject) => {
        conn.executeQuery(query, [], (err: any, result: any) => {
            if(err){
                console.log('Error executing query: '+ JSON.stringify(err))
                reject(err)
            }
            resolve(result)
        })
    })
}

export async function ingestResourceInFhir(conn, schemaName, jsonSchema, data, requestType){
    return new Promise(async (resolve, reject) => {
        //Check if record exists
        let recordExistsResult: any = await checkIfRecordExists(conn, schemaName, data.resourceType, data.id)
        if(requestType.method == 'POST'){
            //Do not create resource if already exists
            if(recordExistsResult.length > 0){
                console.log(`Resource ${data.resourceType} with id ${data.id} already exists!`)
                resolve(`Resource ${data.resourceType} with id ${data.id} already exists!`)
            }else{
                let result = await parseAndInsertData(conn, schemaName, jsonSchema, data)
                console.log(`Resource ${data.resourceType} with id ${data.id} inserted successfully!`)
                resolve(result)
            }
        } else if(requestType.method == 'PUT'){
            if(recordExistsResult.length > 0){
                //Set current record to inactive
                await updateResourceStatus(conn, schemaName, data.resourceType, data.id)
                //Insert new record for the resource
                let result = await parseAndInsertData(conn, schemaName, jsonSchema, data)
                console.log(`Resource ${data.resourceType} with id ${data.id} updated successfully!`)
                resolve(result)
            }else{
                console.log(`Cannot update resource ${data.resourceType} with id ${data.id} as it doesn't exist in DB!`)
                resolve(`Cannot update resource ${data.resourceType} with id ${data.id} as it doesn't exist in DB!`)
            }
        }
        else if(requestType.method == 'DELETE'){
            if(recordExistsResult.length > 0){
                await updateResourceStatus(conn, schemaName, data.resourceType, data.id)
                console.log(`Resource ${data.resourceType} with id ${data.id} deleted successfully!`)
                resolve(true)
            }else{
                console.log(`Cannot delete resource ${data.resourceType} with id ${data.id} as it doesn't exist in DB!`)
                resolve(`Cannot delete resource ${data.resourceType} with id ${data.id} as it doesn't exist in DB!`)
            }
        }
        else{
            return false
        }
    })
}

async function parseAndInsertData(conn, schemaName, jsonSchema, data){
    return new Promise(async (resolve, reject) => {
        try{
            const parsedFhirDefinitions = getFhirTableStructure(jsonSchema, data.resourceType)
            const insertStatement = getInsertStatement(data, parsedFhirDefinitions)
            await insertIntoFhirTable(conn, schemaName, data.resourceType, insertStatement)
            resolve(true)
        }catch(err){
            reject(err)
        }
    })
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
    let formattedDate = (moment(Date.now())).format('YYYY-MM-DD HH:mm:ss')
    insertColNames.push('isActive')
    insertColNames.push('createAt')
    insertColNames.push('lastUpdateAt')
    insertColValues.push(`'True'`)
    insertColValues.push(`'${formattedDate}'`)
    insertColValues.push(`'${formattedDate}'`)
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

function getFhirTableStructure(jsonSchema, fhirDefinitionName){
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
    for(let i=0; i<schema.discriminator.mapping.length; i++){
        if(schema.discriminator.mapping[i][0] == resourceDefinition)
            return true
    }
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

function insertIntoFhirTable(conn: ConnectionInterface, schemaName, fhirResource, insertStatement){
    return new Promise((resolve, reject) => {
        conn.executeQuery(`INSERT INTO ${schemaName}.${fhirResource}Fhir ${insertStatement}`, [], (err: any, result: any) =>{
            if(err)
                reject(err)
            resolve(result)
        })
    })
}

function checkIfRecordExists(conn:ConnectionInterface, schemaName, fhirResource, fhirResourceId){
    console.info(`Check if record exists in DB: ${fhirResourceId}`)
    return new Promise((resolve, reject) => {
        conn.executeQuery(`SELECT * FROM ${schemaName}.${fhirResource}Fhir WHERE id = '${fhirResourceId}'`, [], (err: any, result: any) => {
            if(err){
                console.log('Error while checking if the resource exists in DB: '+ JSON.stringify(err))
                reject(err)
            }
            resolve(result)
        })
    })
}

function updateResourceStatus(conn:ConnectionInterface, schemaName, fhirResource, fhirResourceId){
    let formattedDate = (moment(Date.now())).format('YYYY-MM-DD HH:mm:ss')
    return new Promise((resolve, reject) => {
        conn.executeQuery(`UPDATE ${schemaName}.${fhirResource}Fhir SET isActive = 'False', lastUpdateAt = '${formattedDate}' WHERE id = ${fhirResourceId}`, [], (err: any, result: any) =>{
            if(err){
                console.log(`Error updating resource status: ${JSON.stringify(err)}`)
                reject(err)
            }
            resolve(result)
        })
    })
}

export async function ingestQRResourceInCacheDB(conn, schemaName, data): Promise<any> {
    const questionnaireResponse = data as QuestionnaireResponse;
    let query = `insert into gdm_questionnaire_response ("id", "person_id", "etl_source_table", "etl_source_table_record_id", "etl_source_table_record_created_at", "etl_session_id", "etl_started_at") values('${questionnaireResponse.id}', 0, 'XYZ', 789, '2024-07-23', 'avsade', now())`;
    await executeQuery(conn, query)
    if(questionnaireResponse.item.length > 0){
      await handleItems(questionnaireResponse.item, questionnaireResponse.id, conn, schemaName)
      console.log('Items inserted successfully!')
    }
    console.log('FHIR QuestionnaireResponse resource successfully inserted into OMOP GDM tables')
    return true
}
  
async function handleItems(items: QuestionnaireResponseItem[], questionnaireResponseId: string, conn: ConnectionInterface, schemaName: string) {
    for(var item of items){
        let itemId = uuidv4();
        let query = `insert into ${schemaName}.gdm_item ("id", "gdm_questionnaire_response_id", "link_id", "text", "definition", "etl_started_at") values('${itemId}', '${questionnaireResponseId}', '${item.linkId}', '${item.text}', '${item.definition}', now())`
        await executeQuery(conn, query)
        if(item.answer && item.answer.length > 0){
            await handleAnswers(item.answer, itemId, conn, schemaName)
            console.log('Answers inserted successfully!')
        }
        if(item.item && item.item.length > 0){
            await handleItems(item.item, questionnaireResponseId, conn, schemaName)
        }
    }
    return
}
  
async function handleAnswers(answers: QuestionnaireResponseItemAnswer[], itemId: string, conn: ConnectionInterface, schemaName: string) {
    for(var answer of answers){
        let answerValue = ""
        let answerType = ""
        let answerId = uuidv4();
        if(answer.valueBoolean){
            answerValue = answer.valueBoolean.toString()
            answerType = "valueBoolean"
        } else if(answer.valueDecimal){
            answerValue = answer.valueDecimal.toString()
            answerType = "valueDecimal"
        } else if (answer.valueInteger){
            answerValue = answer.valueInteger.toString()
            answerType = "valueInteger"
        }else if(answer.valueDate){
            answerValue = answer.valueDate.toString()
            answerType = "valueDate"
        } else if(answer.valueDateTime){
            answerValue = answer.valueDateTime.toString()
            answerType = "valueDateTime"
        } else if(answer.valueTime){
            answerValue = answer.valueTime.toString()
            answerType = "valueTime"
        } else if(answer.valueString != ""){
            answerValue = answer.valueString
            answerType = "valueString"
        } else if(answer.valueUri != ""){
            answerValue = answer.valueUri
            answerType = "valueUri"
        } else if(answer.valueAttachment !== undefined && answer.valueAttachment.contentType != ""){
            answerType = "valueAttachment"
        } else if(answer.valueCoding !== undefined && answer.valueCoding.code != ""){
            answerType = "valueCoding"
        }else if(answer.valueQuantity !== undefined && answer.valueQuantity?.value){
            answerType = "valueQuantity"
        }
        else{
            answerType = "valueReference"
        }
        let query = `INSERT INTO ${schemaName}.gdm_answer
            (id, gdm_item_id, value_type, value, valueattachment_contenttype, valueattachment_language, valueattachment_data, valueattachment_url, valueattachment_size, valueattachment_hash, valueattachment_title, valueattachment_creation, valuecoding_system, valuecoding_version, valuecoding_code, valuecoding_display, valuecoding_userselected, valuequantity_value, valuequantity_comparator, valuequantity_unit, valuequantity_system, valuequantity_code, valuereference_reference, valuereference_type, valuereference_identifier, valuereference_display, etl_started_at)
            VALUES('${answerId}', '${itemId}', '${answerType}', '${answerValue}', '${answer.valueAttachment!== undefined?answer.valueAttachment.contentType: ''}', '${answer.valueAttachment!== undefined?answer.valueAttachment.language:''}', '${answer.valueAttachment!== undefined?answer.valueAttachment.data: ''}', '${answer.valueAttachment!== undefined?answer.valueAttachment.url: ''}', '${answer.valueAttachment!== undefined?answer.valueAttachment.size: ''}', '${answer.valueAttachment!== undefined?answer.valueAttachment.hash:''}', '${answer.valueAttachment!== undefined?answer.valueAttachment.title:''}','${answer.valueAttachment!== undefined?answer.valueAttachment.creation:'1900-01-01 00:00:00'}', '${answer.valueCoding!== undefined?answer.valueCoding.system:''}', '${answer.valueCoding!== undefined?answer.valueCoding.version:''}', '${answer.valueCoding!== undefined?answer.valueCoding.code:''}', '${answer.valueCoding!== undefined?answer.valueCoding.display:''}', '${answer.valueCoding!== undefined?answer.valueCoding.userSelected:''}', '${answer.valueQuantity!== undefined?answer.valueQuantity.value: ''}', '${answer.valueQuantity!== undefined?answer.valueQuantity.comparator:''}', '${answer.valueQuantity!== undefined?answer.valueQuantity.unit:''}', '${answer.valueQuantity!== undefined?answer.valueQuantity.system:''}', '${answer.valueQuantity!== undefined?answer.valueQuantity.code:''}', '${answer.valueReference!== undefined?answer.valueReference.reference:''}', '${answer.valueReference!== undefined?answer.valueReference.type:''}', '${answer.valueReference!== undefined?answer.valueReference.identifier:''}', '${answer.valueReference!== undefined?answer.valueReference.display:''}', now())`

        await executeQuery(conn, query)
    }
    return
}

async function executeQuery(conn: ConnectionInterface, query: string) {
    return new Promise((resolve, reject) => {
        conn.executeQuery(query, [], (err: any, result: any) => {
            if(err){
                console.log('Error executing query: '+ JSON.stringify(err))
                reject(err)
            }
            resolve(result[0])
        })
    })
}