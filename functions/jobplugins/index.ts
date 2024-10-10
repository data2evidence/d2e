import express from "npm:express@4.18.2";
import pg from "npm:pg";
import { DeploymentRouter } from "./src/routes/DeploymentRouter.ts";

const app = express();
const env = Deno.env.toObject();
const deploymentRouter = new DeploymentRouter();

app.use("/jobplugins/deployment", deploymentRouter.router);

const opt = {
  user: env.PG_USER,
  password: env.PG_PASSWORD,
  host: env.PG__HOST,
  port: parseInt(env.PG__PORT),
  database: env.PG__DB_NAME,
};
const pgclient = new pg.Client(opt);
await pgclient.connect();
const r = await pgclient.query(
  `SELECT name,url,payload::JSON FROM trex.plugins where payload->'flow' is not null`
);
let flows = [];
for (const row of r.rows) {
  if (row.payload.flow.flows) flows = flows.concat(row.payload.flow.flows);
}

if (!env.PREFECT_API_URL) {
  console.error("Prefect URL not defined: skipping flow plugins");
}

async function callPrefect(name) {
  const res = await fetch(
    `${env.PREFECT_API_URL}/deployments/name/${name}/${name}`,
    {
      method: "GET",
    }
  );
  if (res.status != 200) {
    console.error(`Error getting flow`);
    console.log(res);
  }
  const flow = await res.json();
  console.log(flow);
  const res2 = await fetch(
    `${env.PREFECT_API_URL}/deployments/${flow["id"]}/create_flow_run`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }
  );
  if (res2.status != 200) {
    console.log(`Error creating flow run`);
    console.log(res2);
  }
  return await res2.json();
}

// Get list of job plugins
app.get("/jobplugins", (req, res) => {
  try {
    const plugins = flows.map((f) => ({ name: f["name"], type: f["type"] }));
    res.send(JSON.stringify(plugins));
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Test endpoint
app.get("/jobplugins/test", (req, res) => {
  try {
    res.send(req.query.dsid);
    console.log("test avoid callback, to use async");
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Execute job plugin by name
app.get("/jobplugins/exec/:name", async (req, res) => {
  try {
    const _flows = flows.filter((flow) => flow["name"] === req.params.name);
    console.log("test avoid callback, to use async");

    if (_flows.length === 0) {
      return res.status(404).send({ message: "Flow not found" });
    }

    const result = await callPrefect(_flows[0]["name"]);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Execute job plugin by type
app.get("/jobplugins/exec_type/:type", async (req, res) => {
  try {
    const _flows = flows.filter((flow) => flow["type"] === req.params.type);

    if (_flows.length === 0) {
      return res.status(404).send({ message: "Flow not found" });
    }

    const result = await callPrefect(_flows[0]["name"]);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.get("/jobplugins/exec_datamodel/:datamodel", async (req, res) => {
  try {
    const _flows = flows.filter((flow) => {
      return (
        flow["type"] === "datamodel" &&
        flow["datamodels"]?.indexOf(req.params.datamodel) > -1
      );
    });

    if (_flows.length === 0) {
      return res
        .status(404)
        .send({ message: "No flows found for the datamodel" });
    }

    const flowName = _flows[0]["name"];
    const result = await callPrefect(flowName);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.listen(8000);
