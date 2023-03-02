export const getRateTime = async (start, end, base, toCurrency) => {
  console.log(
    "🚀 ~ file: getRateTime.js:2 ~ getRateTime ~ toCurrency:",
    toCurrency
  );
  console.log("🚀 ~ file: getRateTime.js:2 ~ getRateTime ~ base:", base);
  const res = await fetch(
    `https://api.exchangerate.host/timeseries?start_date=${start}&end_date=${end}&base=${base}&symbols=${toCurrency}`
  );
  return res.json();
};
