import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import * as yaml from "yaml";
import * as fs from "fs";
import * as schemas from "../controllers/validators/validationSchemas.ts";
import * as conceptSchemas from "../controllers/validators/conceptSchemas.ts";

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
  path: "/terminology/concept/filter-options",
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

registry.registerPath({
  method: "get",
  path: "/terminology/fhir/4_0_0/valueset/$expand",
  description: "Get concept sets",
  summary: "Get all concept sets",
  security: [{ [bearerAuth.name]: [] }],
  request: { query: conceptSchemas.getConceptsQuery },
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

registry.registerPath({
  method: "get",
  path: "/terminology/fhir/4_0_0/conceptmap/$translate",
  description: "Get concept sets",
  summary: "Get all concept sets",
  security: [{ [bearerAuth.name]: [] }],
  request: {
    query: conceptSchemas.getTerminologyDetailsWithRelationshipsQuery,
  },
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
registry.registerPath({
  method: "post",
  path: "/terminology/concept/searchByName",
  description: "Get concept sets",
  summary: "Get all concept sets",
  security: [{ [bearerAuth.name]: [] }],
  request: {
    body: {
      content: {
        "application/json": { schema: conceptSchemas.searchConceptByNameBody },
      },
    },
  },
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
registry.registerPath({
  method: "post",
  path: "/terminology/concept/searchById",
  description: "Get concept sets",
  summary: "Get all concept sets",
  security: [{ [bearerAuth.name]: [] }],
  request: {
    body: {
      content: {
        "application/json": { schema: conceptSchemas.searchConceptByIdBody },
      },
    },
  },
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

registry.registerPath({
  method: "post",
  path: "/terminology/concept/searchByCode",
  description: "Get concept sets",
  summary: "Get all concept sets",
  security: [{ [bearerAuth.name]: [] }],
  request: {
    body: {
      content: {
        "application/json": { schema: conceptSchemas.searchConceptByCodeBody },
      },
    },
  },
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

registry.registerPath({
  method: "post",
  path: "/terminology/concept/recommended/list",
  description: "Get a list of recommended concepts",
  summary: "Get all concept sets",
  security: [{ [bearerAuth.name]: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: conceptSchemas.getRecommendedConceptsBody,
        },
      },
    },
  },
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

registry.registerPath({
  method: "get",
  path: "/terminology/concept/hierarchy",
  description: "Get a list of recommended concepts",
  summary: "Get all concept sets",
  security: [{ [bearerAuth.name]: [] }],
  request: {
    query: conceptSchemas.getConceptHierarchy,
  },
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

/****** **************** ******/
/****** SCHEMAS END HERE ******/
/****** **************** ******/

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
