import LogtoClient from "@logto/express";
import cookieParser from "cookie-parser";
import session from "express-session";
import { handleAuthRoutes } from "@logto/express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import express from "express";

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const app = express();
const port = 8887;
const LOGTO_API_FQDN = "https://host.docker.internal:3001";
const RESOURCE_API = "http://localhost:8887";

export const config = {
  endpoint: LOGTO_API_FQDN,
  appId: "1d6wuydanyaiypbkchxzu",
  appSecret: "yFRvkJg8NKXx3phL27QembSa4ZHzcVD5",
  baseUrl: "http://localhost:8887", // Change to your own base URL
  scopes: ["initial_admin"],
  // fetchUserInfo: true,
  // resource: "http://localhost:8887",
};

// Used when cookie is "secure:true" and when this will be behind caddy
// app.set("trust proxy", 1); // trust first proxy

app.use(cookieParser());
app.use(
  session({
    secret: "1slyeYiD5JU70KV6Is7v4D83ZRklI0qt",
    cookie: {
      maxAge: 14 * 24 * 60 * 60,
      // secure: true
    },
    resave: false,
    saveUninitialized: false,
  })
);

app.use(handleAuthRoutes(config));

app.get(
  "/fetch-access-token",
  LogtoClient.withLogto({
    ...config,
    getAccessToken: true,
    resource: RESOURCE_API,
  }),
  (request, response) => {
    response.json(request.user);
  }
);

// app.use(
//   LogtoClient.withLogto({
//     ...config,
//   })
// );

app.get("/", (request, response) => {
  response.setHeader("content-type", "text/html");
  response.end(
    `<h1>Hello Logto</h1>
		<div><a href="/logto/sign-in">Sign In</a></div>
    <div><a href="/fetch-access-token">Fetch access token</a></div>
    <div><a href="/protected">Protected Resource</a></div>
		<div><a href="/logto/sign-out">Sign Out</a></div>`
  );
});

const verifyAuthFromRequest = async (req, res, next) => {
  const extractBearerTokenFromHeaders = ({ authorization }) => {
    try {
      const bearerTokenIdentifier = "Bearer";

      if (!authorization) {
        // res.status(401).json({
        //   code: "auth.authorization_header_missing",
        //   status: 401,
        // });
        res.redirect("/logto/sign-in");
      }

      if (!authorization.startsWith(bearerTokenIdentifier)) {
        // res.status(401).json({
        //   code: "auth.authorization_token_type_not_supported",
        //   status: 401,
        // });
        res.redirect("/logto/sign-in");
      }
      return authorization.slice(bearerTokenIdentifier.length + 1);
    } catch (e) {
      res.status(500).json(e.message);
    }
  };

  // Extract the token
  const token = extractBearerTokenFromHeaders(req.headers);

  try {
    const { payload } = await jwtVerify(
      token, // The raw Bearer Token extracted from the request header
      createRemoteJWKSet(new URL(`${LOGTO_API_FQDN}/oidc/jwks`)), // generate a jwks using jwks_uri inquired from Logto server
      {
        // expected issuer of the token, should be issued by the Logto server
        issuer: `${LOGTO_API_FQDN}/oidc`,
        // expected audience token, should be the resource indicator of the current API
        audience: RESOURCE_API,
      }
    );

    console.log(JSON.stringify(payload));
  } catch (e) {
    res.status(401).json(e.message);
  }

  next();
};

// const requireAuth = async (req, res, next) => {
//   if (!req.user.isAuthenticated) {
//     res.redirect("/logto/sign-in");
//   }
//   next();
// };

app.get("/protected", verifyAuthFromRequest, (req, res) => {
  res.end("protected resource");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
