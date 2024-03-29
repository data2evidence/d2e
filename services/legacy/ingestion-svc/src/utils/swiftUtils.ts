const Swift = require('client-swift')
import * as config from './config'

let getSwiftClient = async () => {
    try {
      let swift_url = config.getProperties().SWIFT_URL
      let swift_username = config.getProperties().SWIFT_USERNAME
      let swift_password = config.getProperties().SWIFT_PASSWORD
      let swift_tenant = config.getProperties().SWIFT_TENANT
  
      return await new Swift({
        authUrl: swift_url,
        userName: swift_username,
        apiKey: swift_password,
        tenant: swift_tenant,
        domain: 'Default',
        tenantDomain: 'Default'
      }).authenticate()
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
  
  export let createSwiftContainer = async () => {
    let container = undefined
    try {
      let alp_system_id = config.getProperties().ALP_SYSTEM_ID
      let swiftClient = await getSwiftClient()
  
      const containerName = `INGESTION-SVC-${alp_system_id}`
  
      // get containers list
      let containers = await swiftClient.list()
      for (let i = 0; i < containers.length; i++) {
        if (containers[i].name === containerName) container = swiftClient.Container(containers[i].name)
      }
      // get objects list
      if (container !== undefined) {
        let objects = await container.list()
        //if the number of objects is just under 1 million then create a new container
        if (objects !== undefined && objects.length >= 900000) {
          //Create a new container with timestamp as suffix
          let newContainerName =`INGESTION-SVC-${alp_system_id}-${new Date().valueOf().toString()}`
          await swiftClient.create(newContainerName)
          let obj = undefined
          //Loop through all the objects from the existing container
          for (let j = 0; j < objects.length; j++) {
            obj = container.Object(objects[j].name)
            //Move object to the new container
            await obj.copy(newContainerName, objects[j].name)
            //Delete the same object from the existing container
            await container.delete(objects[j].name)
          }
        }
      } else {
        console.log(`Creating container: ${containerName}`)
        //Create container
        container = await swiftClient.create(containerName)
      }
    } catch (e: any) {
      throw new Error(e.message)
    }
    return container
  }
  
  export let createSwiftObjects = async (
    container: any,
    objectPath: any,
    obj: any,
    isUpdateMetadata: boolean,
    metadataObj?: object
  ) => {
    try {
      let object = await container.create(objectPath, obj)
      if (isUpdateMetadata) await object.updateMetadata(metadataObj)
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
  