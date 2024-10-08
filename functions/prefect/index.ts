import express from "npm:express@4.18.2";

const app = express();
const env = Deno.env.toObject();

if (!env.PREFECT_API_URL) {
  console.error("Prefect URL not defined: skipping flow plugins");
}

app.post("/prefect/api/deployments/filter", async (req, res) => {
  try {
    if (req.body === null) {
      console.log("empty request body");
    }
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body), // Send an empty object as the request body
    };
    const res2 = await fetch(
      `${env.PREFECT_API_URL}/deployments/filter`,
      options
    );
    const jsonResponse = await res2.json();
    console.log(jsonResponse);
    res.send(jsonResponse);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.post("/prefect/api/flow_runs/count", async (req, res) => {
  try {
    if (req.body === null) {
      console.log("empty request body");
    }
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body), // Send an empty object as the request body
    };
    const res2 = await fetch(`${env.PREFECT_API_URL}/flow_runs/count`, options);
    const jsonResponse = await res2.json();
    res.send(jsonResponse);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.get("/prefect/api/flow_runs/:flowId", async (req, res) => {
  try {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res2 = await fetch(
      `${env.PREFECT_API_URL}/flow_runs/${req.params.flowId}`,
      options
    );
    const jsonResponse = await res2.json();
    res.send(jsonResponse);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});
// Generic handler for all routes and methods
// app.all("/prefect/api/*", async (req, res) => {
//   try {
//     const path = req.path.replace("/prefect/api", ""); // Strip the `/prefect/api` prefix
//     const method = req.method;
//     const url = `${env.PREFECT_API_URL}${path}`;

//     // Prepare the fetch options
//     const options = {
//       method,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     };

//     console.log(JSON.stringify(options));

//     // Only set body for POST, PUT, or PATCH requests
//     if (["POST", "PUT", "PATCH"].includes(method)) {
//       options.body = JSON.stringify(req.body);
//     }

//     // Make the fetch call
//     const response = await fetch(url, options);
//     // Check if the request was successful
//     if (!response.ok) {
//       console.error(`Error: ${response.status} ${response.statusText}`);
//       return res.status(response.status).send({
//         error: `Error fetching ${path}`,
//         statusText: response.statusText,
//       });
//     }

//     const jsonResponse = await response.json();
//     res.send(jsonResponse);
//   } catch (error) {
//     console.error("Request failed:", error);
//     res.status(500).send({ error: "Internal Server Error" });
//   }
// });

app.listen(8120);
