import express from "npm:express";

const app = express();
const env = Deno.env.toObject();

if (!env.PREFECT_API_URL) {
  console.error("Prefect URL not defined: skipping flow plugins");
}

// Generic handler for all routes and methods
app.all("/prefect/api/*", async (req, res) => {
  try {
    const path = req.path.replace("/prefect/api", ""); // Strip the `/prefect/api` prefix
    const method = req.method;
    const url = `${env.PREFECT_API_URL}${path}`;

    // Prepare the fetch options
    let options;

    // Only set body for POST, PUT, or PATCH requests
    if (["POST", "PUT", "PATCH"].includes(method)) {
      options = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      };
    } else {
      options = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };
    }

    const response = await fetch(url, options);
    // Check if the request was successful
    if (!response.ok) {
      console.error(`Error: ${response.status} ${response.statusText}`);
      return res.status(response.status).send({
        error: `Error fetching ${path}`,
        statusText: response.statusText,
      });
    }

    const jsonResponse = await response.json();
    res.send(jsonResponse);
  } catch (error) {
    console.error("Request failed:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.listen(8000);