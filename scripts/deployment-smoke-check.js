const http = require("http");
const https = require("https");

const webUrl = process.env.DEPLOYMENT_WEB_URL;
const apiUrl = process.env.DEPLOYMENT_API_URL;

if (!webUrl || !apiUrl) {
  console.error(
    "Missing DEPLOYMENT_WEB_URL or DEPLOYMENT_API_URL environment variables."
  );
  process.exit(1);
}

const requestWithTimeout = (url, timeoutMs = 10000) => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const req = client.get(url, (res) => {
      let data = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve({ statusCode: res.statusCode, body: data });
      });
    });

    req.on("error", reject);
    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error(`Request timed out after ${timeoutMs}ms`));
    });
  });
};

const run = async () => {
  const webResponse = await requestWithTimeout(webUrl);
  if (webResponse.statusCode !== 200) {
    throw new Error(
      `Web smoke check failed: ${webUrl} returned ${webResponse.statusCode}`
    );
  }
  if (!webResponse.body.includes("Canary page is live")) {
    throw new Error(
      "Web smoke check failed: expected canary page content not found."
    );
  }

  const apiResponse = await requestWithTimeout(apiUrl);
  if (apiResponse.statusCode !== 200) {
    throw new Error(
      `API smoke check failed: ${apiUrl} returned ${apiResponse.statusCode}`
    );
  }

  let apiBody;
  try {
    apiBody = JSON.parse(apiResponse.body);
  } catch (error) {
    throw new Error("API smoke check failed: response was not valid JSON.");
  }

  if (!apiBody || apiBody.status !== "ok") {
    throw new Error("API smoke check failed: expected status \"ok\".");
  }

  console.log("Deployment smoke check passed.");
};

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
