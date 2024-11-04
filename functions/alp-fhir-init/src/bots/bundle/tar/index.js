"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
var axios_1 = __importDefault(require("axios"));
var https_1 = __importDefault(require("https"));
const getRequestConfig = async (token, ca_crt) => {
    let options = {};
    options = {
        headers: {
            Authorization: 'Bearer ' + token
        },
        httpsAgent: new https_1.default.Agent({
            rejectUnauthorized: true,
            ca: ca_crt
        })
    };
    return options;
};
const getClientCredentialsToken = async (clientId, clientSecret, authUrl) => {
    const params = {
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret
    };
    const options = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        httpsAgent: new https_1.default.Agent({ rejectUnauthorized: false })
    };
    const data = Object.keys(params)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join("&");
    const result = await axios_1.default.post(authUrl, data, options);
    return result.data.access_token;
};

const insertIntoFhirDataModel = async (resourceType, inputData, secret_gateway_crt, secret_client_id, secret_client_secret, secret_fhir_route_auth, secret_fhir_svc_route) => {
    try {
        console.log('Entered insertIntoFhirDataModel');
        const token = await getClientCredentialsToken(secret_client_id, secret_client_secret, secret_fhir_route_auth);
        console.log(`Token: ${token}`)
        const options = await getRequestConfig(token, secret_gateway_crt);
        console.log(`Options: ${JSON.stringify(options)}`)
        const baseUrl = secret_fhir_svc_route;
        if (baseUrl) {
            const url = `${baseUrl}/ingestResource/${resourceType}`;
            const result = await axios_1.default.post(url, inputData, options);
            console.log(result.data);
            return result.data;
        }
        else {
            throw new Error('No url is set for Fhir Service');
        }
    }
    catch (error) {
        console.log('Error while inserting into fhir datamodel');
        throw new Error('Error while inserting into fhir datamodel');
    }
};
async function handler(medplum, event) {
    try {
        let bundle = event.input;
        let secret_gateway_crt = event.secrets['gateway_crt'].valueString.replace(/\\n/g, '\n');
        console.log(secret_gateway_crt)
        let secret_client_id = event.secrets['client_id'].valueString;
        let secret_client_secret = event.secrets['client_secret'].valueString;
        let secret_fhir_route_auth = event.secrets['fhir_route_auth'].valueString;
        let secret_fhir_svc_route = event.secrets['fhir_svc_route'].valueString;
        console.log(`${secret_gateway_crt}, ${secret_client_id}, ${secret_client_secret}, ${secret_fhir_route_auth}, ${secret_fhir_svc_route}`)

        console.log('Entered bundle bot handler');
        if (bundle.entry === undefined) {
            console.log('No entries in the bundle');
            return;
        }
        console.log('Create resource for each of the entry in the bundle');
        await insertIntoFhirDataModel('Bundle', bundle, secret_gateway_crt, secret_client_id, secret_client_secret, secret_fhir_route_auth, secret_fhir_svc_route);
    }
    catch (err) {
        console.log(err);
    }
}
exports.handler = handler;
