import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import * as yaml from "yaml";
import * as fs from "fs";
import * as schemas from "./validationSchemas.ts";

type Method =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "head"
  | "options"
  | "trace";

const registry = new OpenAPIRegistry();

const UserIdSchema = registry.registerParameter("UserId", schemas.UserIdSchema);

const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

// registry.registerPath({
//   method: "get",
//   path: "/users/{id}",
//   description: "Get user data by its id",
//   summary: "Get a single user",
//   security: [{ [bearerAuth.name]: [] }],
//   request: {
//     params: z.object({ id: UserIdSchema }),
//   },
//   responses: {
//     200: {
//       description: "Object with user data.",
//       content: {
//         "application/json": {
//           schema: schemas.UserSchema,
//         },
//       },
//     },
//     204: {
//       description: "No content - successful operation",
//     },
//   },
// });

registry.registerPath({
  method: "get",
  path: "/terminology/concept-set",
  description: "Get concept sets",
  summary: "Get all concept sets",
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: {
      description: "Object with concept set data.",
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

// writeDocumentation();
// deno run --allow-env --allow-read --allow-write src/openApi.ts
const routeMap = registry.definitions
  .filter((v) => v.type === "route")
  .map((v) => {
    if (v.type === "route") {
      return { method: v.route.method, path: v.route.path };
    }
  })
  .reduce(
    (map, obj) => {
      if (!obj) return map;
      const key = `${obj.method}:${obj.path}`;
      map[key] = obj;
      return map;
    },
    {} as {
      [key: string]: {
        method: Method;
        path: string;
      };
    }
  );

export { routeMap, writeDocumentation };
