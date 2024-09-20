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