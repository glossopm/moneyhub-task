const { parse } = require("json2csv");

const generateReportCsv = (reportJson) => {
  const parserOptions = {
    fields: [
      { label: "User", value: "user" },
      { label: "First Name", value: "firstName" },
      { label: "Last Name", value: "lastName" },
      { label: "Date", value: "date" },
      { label: "Holding", value: "holding" },
      { label: "Value", value: "value" },
    ],
  };

  try {
    return parse(reportJson, parserOptions);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.generateReportCsv = generateReportCsv;
