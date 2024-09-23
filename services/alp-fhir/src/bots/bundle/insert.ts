import { getCachedbDbConnections } from 'src/utils/cachedb';
import { getFhirTableStructure } from '../../utils/fhirDataModelhelper';
import { ConnectionInterface } from '@alp/alp-base-utils/target/src/Connection';
const schemaPath = process.env.FHIR_SCHEMA_PATH+ "/" + process.env.FHIR_SCHEMA_FILE_NAME

export async function createResourceInFhir(data, datasetId: string): Promise<boolean> {
    const conn = await getCachedbDbConnections(datasetId)
    console.log(JSON.stringify(conn))
    try{
        return new Promise((resolve, reject) => {
            conn.executeQuery(`select * from read_json('${schemaPath}')`, [], async (err: any, result: any) => {
                if(err){
                    console.log('Error loading fhir schema json: '+ JSON.stringify(err))
                    reject(err)
                }
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
        console.log(err)
    }finally{
        conn.close()
    }
}

function getInsertStatement(data, parsedFhirDefinitions){
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
    let insertColNames = [];
    let insertColValues  = []
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
    let arrayValues = []
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
    let colValues = []
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

async function insertIntoFhirTable(conn: ConnectionInterface, fhirResource, insertStatement, callback){
   conn.executeQuery(`INSERT INTO ${fhirResource}Fhir ${insertStatement}`, [], (err: any, result: any) =>{
        callback(err, result)
    })
}