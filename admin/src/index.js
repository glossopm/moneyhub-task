const express = require("express");
const bodyParser = require("body-parser");
const config = require("config");
const fetch = require("node-fetch");
const { generateReportJson } = require("./utils/generate-report-json");
const { generateReportCsv } = require("./utils/generate-csv");
const app = express();

app.use(bodyParser.json({ limit: "10mb" }));

// GET single investment
app.get("/investments/:id", async (req, res) => {
  const { id } = req.params;
  const investmentsResponse = await fetch(
    `${config.investmentsServiceUrl}/investments/${id}`
  ).catch((e) => {
    console.log(e);
    req.sendStatus(500);
  });

  res.send(await investmentsResponse.text());
});

// Generate investment report and send to investments api on the /investments/generate route
app.post("/report/generate", async (req, res) => {
  const investmentsResponse = await fetch(
    `${config.investmentsServiceUrl}/investments`
  ).catch((e) => {
    console.log(e);
    req.sendStatus(500);
  });

  const investmentsText = await investmentsResponse.text();

  const companiesResponse = await fetch(
    `${config.companiesServiceUrl}/companies`
  ).catch((e) => {
    req.sendStatus(500);
    console.log(e);
  });

  const companiesText = await companiesResponse.text();

  const csvReport = await generateReportCsv(
    generateReportJson(investmentsText, companiesText)
  );

  await fetch(`${config.investmentsServiceUrl}/investments/export`, {
    method: "POST",
    body: csvReport,
    headers: { "Content-Type": "text/csv" },
  }).catch((e) => {
    console.log(e);
    req.sendStatus(500);
  });

  console.log("Report sent successfully");
  res.sendStatus(204);
});

app.listen(config.port, (err) => {
  if (err) {
    console.error("Error occurred starting the server", err);
    process.exit(1);
  }
  console.log(`Server running on port ${config.port}`);
});
