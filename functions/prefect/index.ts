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
    console.log("Hey I am here");
    // const res2 = await fetch(`${env.PREFECT_API_URL}/deployments/filter`);
    const res2 = await fetch(`${env.PREFECT_API_URL}/deployments/filter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body), // Send an empty object as the request body
    });
    const jsonResponse = await res2.json();
    console.log(jsonResponse);
    res.send(jsonResponse);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.listen(8000);
