import express from 'npm:express@4.18.2';
import pg from "npm:pg"

const app = express();
const env = Deno.env.toObject()

const opt = {
	user: env.PG_USER,
	password: env.PG_PASSWORD,
	host: env.PG__HOST,
	port: parseInt(env.PG__PORT),
	database: env.PG__DB_NAME,
  }
const pgclient = new pg.Client(opt);
await pgclient.connect()
const r = await pgclient.query(`SELECT name,url,payload::JSON FROM trex.plugins where payload->'flow' is not null`);
let flows = []
for (const row of r.rows) {
	if(row.payload.flow.flows)
		flows = flows.concat(row.payload.flow.flows);
}

if(!env.PREFECT_API_URL) {
	console.error("Prefect URL not defined: skipping flow plugins");
}


async function callPrefect(name) {
	const res = await fetch(`${env.PREFECT_API_URL}/deployments/name/${name}/${name}`, {
		method: "GET"});
	if(res.status != 200){
		console.error(`Error getting flow`);
		console.log(res)
	}
	const flow = await res.json()
	console.log(flow);
	const res2 = await fetch(`${env.PREFECT_API_URL}/deployments/${flow["id"]}/create_flow_run`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
		})
	});
	if(res2.status != 200){
		console.log(`Error creating flow run`);
		console.log(res2);
	}
	return await res2.json()
}

app.get('/jobplugins', (req, res) => {
	res.send(JSON.stringify(flows.map(f => {return {name: f["name"], type: f["type"]}})));
});

app.get('/jobplugins/test', (req, res) => {
	res.send(req.query.dsid);
});

app.get('/jobplugins/exec/:name', (req, res) => {
	const _flows = flows.filter(flow => {
		return flow["name"] == req.params.name;
	});
	callPrefect(_flows[0]['name']).then(r => {
		res.send(r);
	}).catch(e => console.log(e));
});

app.get('/jobplugins/exec_type/:type', (req, res) => {
	const _flows = flows.filter(flow => {
		return flow["type"] == req.params.type;
	});
	callPrefect(_flows[0]['name']).then(r => {
		res.send(r);
	}).catch(e => console.log(e));
});

app.get('/jobplugins/exec_datamodel/:datamodel', (req, res) => {
	const _flows = flows.filter(flow => {
		return flow["type"] == 'datamodel' && flow["datamodels"]?.indexOf(req.params.datamodel) > -1;
	});
	callPrefect(_flows[0]['name']).then(r => {
		res.send(r);
	}).catch(e => console.log(e));
});

app.listen(8000);
