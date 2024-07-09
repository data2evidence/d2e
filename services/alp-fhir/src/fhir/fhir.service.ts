import { OperationOutcome, Project, Resource } from "@medplum/fhirtypes";
import { FhirAPI } from "../api/FhirAPI"

export class FhirService {
    async importData(resource: Resource){
        try{
            let fhirApi = new FhirAPI()
            await fhirApi.clientCredentialslogin()
            let validateResult = await fhirApi.validateResouce(resource) as OperationOutcome
            console.log(`Is input resource valid: ${validateResult.issue?.[0]?.details?.text}`)
            if(validateResult.id == "ok"){
                let result = await fhirApi.createResource(resource)
                console.log(result)
            }else{
                console.log("Failed to import data as validation failed")
            }
        }catch(err){
            console.log(err)
            throw err
        }
    }

    async createProject(name: string, description: string){
        try{
            let fhirApi = new FhirAPI()
            await fhirApi.clientCredentialslogin()
            const resource: Project = {
                resourceType: 'Project',
                name: name,
                description: description,
                features: ['bots']
            }
            return await fhirApi.createResource(resource)
        }catch(err){
            console.log(err)
            throw err
        }
    }
}