import { createLogger } from './logger';
import "reflect-metadata";
import https from 'https'
import helmet from 'helmet'
import { env } from './env'
import express from 'express'
import { readAndCreateBotFromConfig } from './utils/botUtils';
import { Container } from 'typedi'
import Routes from './routes';
import * as pg from "pg";
const logger = createLogger('FHIR Client');

function load_bots(){
  readAndCreateBotFromConfig()
}

const initRoutes = async (app: express.Application) => {
  app.use(helmet())
  app.use(express.json({ strict: false, limit: '50mb' }))
  app.use(express.urlencoded({ extended: true, limit: '50mb' }))
}

const queryPostgres = async (
  client: pg.Client,
  query: string,
  values: Array<string | number>
) => {
  return await client.query(query, values);
};

const seed = async () => {
  const FHIR_CLIENT_ID = process.env.FHIR__CLIENT_ID;
  const FHIR_CLIENT_SECRET = process.env.FHIR__CLIENT_SECRET;

  if (!FHIR_CLIENT_ID || !FHIR_CLIENT_SECRET) {
    throw new Error("No client credentials are set for Fhir");
  }

  let client = new pg.Client({
    user: process.env.PG_SUPER_USER,
    password: process.env.PG_SUPER_PASSWORD,
    host: process.env.PG__HOST,
    port: parseInt(process.env.PG__PORT),
    database: process.env.PG__DB_NAME,
  });

  await client.connect();

  console.log("Retrieving existing Super Admin project and Practitioner ids");

  const projectIdResult = await queryPostgres(
    client,
    `SELECT "projectId" FROM public."Project" WHERE name = 'Super Admin'`,
    []
  );

  const projectId: string = projectIdResult.rows[0].projectId;

  const practitionerResult = await queryPostgres(
    client,
    `SELECT id FROM public."Practitioner" WHERE "projectId" = $1`,
    [projectId]
  );

  const practitioner: string = practitionerResult.rows[0].id;

  console.log("Seeding tables");

  const ClientApplicationContent = `{"meta":{"project":"${projectId}","versionId":"7ef81144-11f4-40ef-a017-da8885a0d36e","lastUpdated":"2024-06-13T06:40:48.738Z","author":{"reference":"Practitioner/${practitioner}","display":"Medplum Admin"},"compartment":[{"reference":"Project/${projectId}"}]},"resourceType":"ClientApplication","name":"d2eClient","secret":"${FHIR_CLIENT_SECRET}","description":"d2eClient","id":"${FHIR_CLIENT_ID}"}`;
  const ProjectMembershipContent = `{"meta":{"project":"${projectId}","versionId":"6e4864a8-b1df-417c-8aa9-35a4cb660e07","lastUpdated":"2024-06-13T06:40:48.762Z","author":{"reference":"system"},"compartment":[{"reference":"Project/${projectId}"}]},"resourceType":"ProjectMembership","project":{"reference":"Project/${projectId}"},"user":{"reference":"ClientApplication/${FHIR_CLIENT_ID}","display":"d2eClient"},"profile":{"reference":"ClientApplication/${FHIR_CLIENT_ID}","display":"d2eClient"},"id":"c5e1a35d-c979-428f-81db-9e3502c3ffa3"}`;

  await queryPostgres(
    client,
    `INSERT INTO public."ClientApplication" (id, content, "lastUpdated", compartments, name, "projectId") \
    VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT(id) \
    DO NOTHING;`,
    [
      `${FHIR_CLIENT_ID}`,
      ClientApplicationContent,
      "2024-06-13 14:40:48.738 +0800",
      `{${projectId}}`,
      "d2eClient",
      projectId,
    ]
  );

  console.log("Seeding Client Application table complete");

  await queryPostgres(
    client,
    `INSERT INTO public."ClientApplication_History" ("versionId", id, content, "lastUpdated") \
    VALUES ($1, $2, $3, $4) ON CONFLICT("versionId") \
    DO NOTHING;`,
    [
      "7ef81144-11f4-40ef-a017-da8885a0d36e",
      `${FHIR_CLIENT_ID}`,
      ClientApplicationContent,
      "2024-06-13 14:40:48.738 +0800",
    ]
  );

  console.log("Seeding Client Application History table complete");

  await queryPostgres(
    client,
    `INSERT INTO public."ProjectMembership" (id, content, "lastUpdated", compartments, project, "user", profile, "profileType", "projectId") \
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT(id) \
    DO NOTHING;
    `,
    [
      "c5e1a35d-c979-428f-81db-9e3502c3ffa3",
      ProjectMembershipContent,
      "2024-06-13 14:40:48.762 +0800",
      `{${projectId}}`,
      `Project/${projectId}`,
      `ClientApplication/${FHIR_CLIENT_ID}`,
      `ClientApplication/${FHIR_CLIENT_ID}`,
      "ClientApplication",
      projectId,
    ]
  );

  console.log("Seeding Project Membership table complete");

  await queryPostgres(
    client,
    `INSERT INTO public."ProjectMembership_History" ("versionId", id, content,"lastUpdated") \ 
    VALUES ($1, $2, $3, $4) ON CONFLICT("versionId") \
    DO NOTHING;`,
    [
      "6e4864a8-b1df-417c-8aa9-35a4cb660e06",
      "c5e1a35d-c979-428f-81db-9e3502c3ffa3",
      ProjectMembershipContent,
      "2024-06-13 14:40:48.762 +0800",
    ]
  );

  console.log("Seeding Project Membership History table complete");

  client.end();
};

const registerRoutes = async (app: express.Application) => {
  const routes = Container.get(Routes)
  app.use('/', routes.getRouter())
}

async function main() {
  const app = express()
  await initRoutes(app)
  await registerRoutes(app)
  
  const server = https.createServer(
      {
          key: process.env.TLS__INTERNAL__KEY,
          cert: process.env.TLS__INTERNAL__CRT,
          maxHeaderSize: 8192 * 10,
      },
      app
    )
      
    server.listen(process.env.PORT)
    logger.info(`🚀 ALP FHIR Client started on port ${env.PORT}`)
    seed()
    load_bots()
}

try {
  main()
} catch (err: any) {
  logger.error(`
        Fhir svc failed to start! Kindly fix the error and restart the application. ${err.message}
        ${err.stack}`)
  process.exit(1)
}
