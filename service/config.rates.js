const Rate = require("./rate");
const Rates = require("./rates");

function configRates(rateDecimal) {
  const rates = new Rates(rateDecimal);

  rates.add(new Rate("EUR", "UYU", 48.6255, 53.7211));
  rates.add(new Rate("UYU", "USD", 44.73, 42.3));
  rates.add(new Rate("EUR", "USD", 1.14954, 1.19646));
  //rates.add(new Rate("ARS", "USD", 1.14954, 1.19646));

  return rates;
}

module.exports = configRates;
