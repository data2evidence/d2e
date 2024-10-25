"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
var axios_1 = __importDefault(require("axios"));
var https_1 = __importDefault(require("https"));
const getRequestConfig = async (token) => {
    let options = {};
    options = {
        headers: {
            Authorization: 'Bearer ' + token
        },
        httpsAgent: new https_1.default.Agent({
            rejectUnauthorized: true,
            ca: ''
        })
    };
    return options;
};
const getClientCredentialsToken = async () => {
    const params = {
        grant_type: "client_credentials",
        client_id: '',
        client_secret: ''
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
    const authUrl = "http://trex.alp.local:33001/oauth/token";
    const result = await axios_1.default.post(authUrl, data, options);
    return result.data.access_token;
};
const insertIntoFhirDataModel = async (resourceType, inputData) => {
    try {
        console.log('Entered insertIntoFhirDataModel');
        const token = await getClientCredentialsToken();
        const options = await getRequestConfig(token);
        const baseUrl = 'http://trex.alp.local:33001/gateway/api/fhir';
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
        console.log('Entered bundle bot handler');
        if (bundle.entry === undefined) {
            console.log('No entries in the bundle');
            return;
        }
        console.log('Create resource for each of the entry in the bundle');
        await insertIntoFhirDataModel('Bundle', bundle);
    }
    catch (err) {
        console.log(err);
    }
}
exports.handler = handler;
