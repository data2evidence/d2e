import { Project } from "@medplum/fhirtypes";
import { FhirAPI } from "../api/FhirAPI"

export class FhirService {
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