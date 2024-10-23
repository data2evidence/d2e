import axios from 'axios';
import https from 'https';

const getRequestConfig = async (token: any) => {
    let options = {};

    options = {
        headers: {
            Authorization: token
        },
        httpsAgent: new https.Agent({
            rejectUnauthorized: true,
            ca: process.env.GATEWAY_CA_CERT
        })
};

return options;
}

const getClientCredentialsToken = async() => {
    interface Map {
      [key: string]: string
    }
    console.log(process.env.IDP__ALP_DATA_CLIENT_ID)
    console.log(process.env.IDP__ALP_DATA__CLIENT_SECRET)
    const params: Map = {
        grant_type: "client_credentials",
        client_id: process.env.IDP__ALP_DATA_CLIENT_ID? process.env.IDP__ALP_DATA_CLIENT_ID: '',
        client_secret: process.env.IDP__ALP_DATA__CLIENT_SECRET? process.env.IDP__ALP_DATA__CLIENT_SECRET: '',
    };

    const options = {
        headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };

    const data = Object.keys(params)
        .map(
        (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(
            params[key]
            )}`
        )
        .join("&");

    const authUrl = process.env.ALP_GATEWAY_OAUTH__URL? process.env.ALP_GATEWAY_OAUTH__URL: ''
    const result = await axios.post(authUrl, data, options);
    console.log(result.data.access_token)
    return result.data.access_token;
}

const insertIntoFhirDataModel = async(resourceType: any, inputData: any)=>{
    try {
        console.log('Entered insertIntoFhirDataModel')
        const token = await getClientCredentialsToken();
        console.log(token)
        const options = await getRequestConfig(token);
        const baseUrl = 'http://trex.alp.local:33001/gateway/api/fhir'
        console.log(baseUrl)
        if (baseUrl){
            const url = `${baseUrl}/createResource/${resourceType}`;
            const result = await axios.post(url, inputData, options);
            console.log(result.data)
            return result.data;
        }
        else {
            throw new Error('No url is set for Fhir Service');
        }
    }
    catch (error)
    {
        console.log('Error while inserting into fhir datamodel');
        throw new Error('Error while inserting into fhir datamodel');
    }
}

export async function handler(medplum: any, event: any) {
    try{
        let bundle = event.input;
        console.log('Entered bundle bot handler');
        if (bundle.entry === undefined) {
            console.log('No entries in the bundle');
            return;
        }
        console.log('Create resource for each of the entry in the bundle');
        await insertIntoFhirDataModel('Bundle', bundle);
    }catch(err){
        console.log(err)
    }
}

