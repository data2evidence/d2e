import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import * as yaml from "yaml";
import * as fs from "fs";
import * as schemas from "./validationSchemas.ts";

const registry = new OpenAPIRegistry();

const UserIdSchema = registry.registerParameter("UserId", schemas.UserIdSchema);

const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

registry.registerPath({
  method: "get",
  path: "/users/{id}",
  description: "Get user data by its id",
  summary: "Get a single user",
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: z.object({ id: UserIdSchema }),
  },
  responses: {
    200: {
      description: "Object with user data.",
      content: {
        "application/json": {
          schema: schemas.UserSchema,
        },
      },
    },
    204: {
      description: "No content - successful operation",
    },
  },
});

function getOpenApiDocumentation() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "My API",
      description: "This is the API",
    },
    servers: [{ url: "v1" }],
  });
}

// TODO: add this to init step, together with migrations
function writeDocumentation() {
  // OpenAPI JSON
  const docs = getOpenApiDocumentation();

  // YAML equivalent
  const fileContent = yaml.stringify(docs);

  fs.writeFileSync(`./openapi-docs.yml`, fileContent, {
    encoding: "utf-8",
  });
}

writeDocumentation();
// deno run --allow-env --allow-read --allow-write src/openApi.ts
