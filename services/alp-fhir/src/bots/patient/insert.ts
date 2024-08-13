import { DuckdbConnection } from './duckdbUtil'
import { Patient } from '@medplum/fhirtypes';
import { getFhirTableStructure } from './helper';
const schemaPath = '/Users/afreen.sikandara/Documents/projects/typescript/src/fhir.schema.json'
const dataPath = '/Users/afreen.sikandara/Documents/projects/typescript/src/sample-data.json'

export async function createResourceInFhir(){
    let duckdb = new DuckdbConnection()
    try{
        await duckdb.createConnection();
        const result = await duckdb.executeQuery(`select * from read_json('${schemaPath}')`)
        const data = await duckdb.executeQuery(`select * from read_json('${dataPath}')`)
        const result1 = await insertIntoFhirTable(duckdb, data[0], result[0])
    }catch(err){
        console.log(err)
    }finally{
        duckdb.close()
    }
}

async function insertIntoFhirTable(duckdb, data: Patient, jsonFhirSchema){
    const resourceType = data.resourceType
    const parsedFhirDefinitions = getFhirTableStructure(jsonFhirSchema, resourceType)
    let resourceProperties = []
    let parsedData = {}
    let abc = {}
    for(const property in parsedFhirDefinitions){
        parsedData[property] = parsedFhirDefinitions[property]
        resourceProperties.push(property)
        abc[property] = parsedFhirDefinitions[property]
        if(data[property] == undefined){
            if(parsedFhirDefinitions[property] == 'boolean')
                parsedData[property] = 'false'
            else
                parsedData[property] = 'Null'
        }
        else 
            parsedData[property] = data[property]
    }
    let cols = customMerge(abc, parsedData)
    let colValues = getDuckdbInsertColumValues(cols)
    console.log(colValues)
    return colValues
}

function customMerge(obj1, obj2) {
    let merged = { ...obj1 };

    //Parse incoming data to duckdb fhir resource table and set default value for all unassigned variables to Null
    for(let key in obj1){
        if(typeof obj1[key] == 'object' && obj1[key].length > 0){
            if(obj1[key][0] == 'string' || obj1[key][0] == 'json')
                merged[key] = obj2[key] && obj2[key] !== 'Null'? obj2[key]: ['']
            else{
                merged[key] = []
                if(obj2[key] !== undefined && obj2[key] !== 'Null' && obj2[key].length > 0){
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
            merged[key] = obj2 == undefined || !obj2.hasOwnProperty(key)
                                ? obj1[key] == 'boolean'? 'false': 'Null'
                                : obj2[key]
    }
    return merged
}

function getDuckdbInsertColumValues(data){
    let insertColNames = [];
    let insertColValues  = []
    for(const property in data){
        insertColNames.push(property)
        if(typeof data[property] == 'object' && data[property].length > 0){
            insertColValues.push(`${getDuckdbArrayColValue(data[property])}`) 
        }
        else if(typeof data[property] == 'object' && Object.prototype.toString.call(data[property]) !== '[object Date]'){
            insertColValues.push(getDuckdbStructColValue('', data[property])) 
        }
        else{
            insertColValues.push(`'${data[property]}'`)
        }
    }
    return `(${insertColNames.join(',')})VALUES(${insertColValues.join(',')})`
}

function getDuckdbArrayColValue(data){
    let arrayValues = []
    let colType = 'array_value('
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
        else
            arrayValues.push(`'${data[i]}'`)
    }    
    return `${colType + arrayValues.join(',')})`
}

function getDuckdbStructColValue(colProperty, structDataType){
    let colValues = []
    for(const property in structDataType){
        if(structDataType[property] && typeof structDataType[property] == 'object' && structDataType[property].length > 0){
            colValues.push(`"${property}" := ${getDuckdbArrayColValue(structDataType[property])}`)
        }else if(typeof structDataType[property] == 'object' && Object.prototype.toString.call(structDataType[property]) !== '[object Date]' && structDataType[property] !== null)
            colValues.push(getDuckdbStructColValue(property, structDataType[property]))
        else
            colValues.push(`"${property}" := '${structDataType[property]}'`)
    }
    return colProperty == ''
            ? `struct_pack(${colValues.join(',')})`
            : `"${colProperty}" := struct_pack(${colValues.join(',')})`
}