const generateReportJson = (investments, companies) => {
  const companiesJson = JSON.parse(companies);
  const companiesObject = Object.fromEntries(
    companiesJson.map((company) => [company.id, company.name])
  );

  return (
    JSON.parse(investments)
      // Loop through the investments
      .map(
        ({ userId, firstName, lastName, date, investmentTotal, holdings }) => {
          // Loop through each holding
          return holdings.map(({ id, investmentPercentage }) => {
            return {
              user: userId,
              firstName,
              lastName,
              date,
              holding: companiesObject[id],
              value: investmentTotal * investmentPercentage,
            };
          });
        }
      )
      .flat()
  );
};

exports.generateReportJson = generateReportJson;
