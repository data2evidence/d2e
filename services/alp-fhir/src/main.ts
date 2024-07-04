import { createLogger } from './logger';
import https from 'https'
import { env } from './env'
import express from 'express'
import { readAndCreateBotFromConfig } from './utils/botUtils';

const app = express()
const logger = createLogger('FHIR Server');

function load_bots(){
  readAndCreateBotFromConfig()
}

async function bootstrap() {
    const server = https.createServer(
        {
            key: "-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEIB31XMs5VTK6bd6zzsTwEQ5Hb1MabcFDi8l/8NdiILhwoAoGCCqGSM49\nAwEHoUQDQgAEuvi6/xKr/yRdHE835ya+OLaCkZMgd28m+WxfT4/9ssAzlMZV5IP2\nY37b2uiDAxHhqyv4XmP9JDC4ts4WVOvbeA==\n-----END EC PRIVATE KEY-----",
            cert: "-----BEGIN CERTIFICATE-----\nMIIBtzCCAV2gAwIBAgIRAKZWe1zlVzrpNlZFUG+pfpowCgYIKoZIzj0EAwIwKjEo\nMCYGA1UEAxMfQUxQIEludGVybmFsIENBIC0gMjAyNCBFQ0MgUm9vdDAeFw0yNDA3\nMDIwMzQ1NTRaFw0yNTA2MjcwMzQ1NTRaMAAwWTATBgcqhkjOPQIBBggqhkjOPQMB\nBwNCAAS6+Lr/Eqv/JF0cTzfnJr44toKRkyB3byb5bF9Pj/2ywDOUxlXkg/Zjftva\n6IMDEeGrK/heY/0kMLi2zhZU69t4o4GNMIGKMA4GA1UdDwEB/wQEAwIHgDAdBgNV\nHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwHQYDVR0OBBYEFKFrbChLnzrHsBUQ\nSS25tysuh4tAMB8GA1UdIwQYMBaAFCU6/vXYMtT4KFf/4rpWTitQ2Ag9MBkGA1Ud\nEQEB/wQPMA2CCyouYWxwLmxvY2FsMAoGCCqGSM49BAMCA0gAMEUCIQChgZ4MrNo6\nnQijOCzByOqfaBHnDASNH8hZIin0T89/8AIgPwVf59uydTeU9i1U6xQ5fGjc0xUN\nBqc1W9cnMdKHcIE=\n-----END CERTIFICATE-----",
            maxHeaderSize: 8192 * 10,
        },
        app
      )
      
    server.listen(8103)
    logger.info(`🚀 ALP FHIR Server started on port 8103`)
    load_bots()
}
bootstrap()
  