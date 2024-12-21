import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import * as conceptSetSchemas from "../controllers/validators/conceptSetSchemas.ts";
import * as schemas from "../controllers/validators/validationSchemas.ts";

export const registerApi = (registry: OpenAPIRegistry) => {
  registry.registerPath({
    method: "get",
    path: "/terminology/concept-set",
    description: "List concept sets",
    summary: "List concept sets",
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
    tags: ["Concept Set"],
  });

  registry.registerPath({
    method: "post",
    path: "/terminology/concept-set",
    description: "Create concept set",
    summary: "Create concept set",
    request: {
      body: {
        content: {
          "application/json": {
            schema: conceptSetSchemas.createConceptSetBody,
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
    tags: ["Concept Set"],
  });

  registry.registerPath({
    method: "get",
    path: "/terminology/concept-set/{conceptSetId}",
    description: "Get concept set",
    summary: "Get concept set",
    request: {
      params: conceptSetSchemas.getConceptSetParams,
      query: conceptSetSchemas.getConceptSetQuery,
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
    tags: ["Concept Set"],
  });

  registry.registerPath({
    method: "put",
    path: "/terminology/concept-set/{conceptSetId}",
    description: "Update concept set",
    summary: "Update concept set",
    request: {
      params: conceptSetSchemas.updateConceptSetParams,
      body: {
        content: {
          "application/json": {
            schema: conceptSetSchemas.updateConceptSetBody,
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
    tags: ["Concept Set"],
  });

  registry.registerPath({
    method: "delete",
    path: "/terminology/concept-set/{conceptSetId}",
    description: "Delete concept set",
    summary: "Delete concept set",
    request: {
      params: conceptSetSchemas.removeConceptSetParams,
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
    tags: ["Concept Set"],
  });

  registry.registerPath({
    method: "post",
    path: "/terminology/concept-set/included-concepts",
    description: "List included concepts for a list of concept sets",
    summary: "List included concepts for a list of concept sets",
    request: {
      body: {
        content: {
          "application/json": {
            schema: conceptSetSchemas.getIncludedConceptsBody,
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
    tags: ["Concept Set"],
  });
};
