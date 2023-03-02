export const getConvert = async (base, toCurrency) => {
  const res = await fetch(
    `https://api.exchangerate.host/convert?from=${String(
      base
    ).toUpperCase()}&to=${String(toCurrency).toUpperCase()}`
  );
  return res.json();
};
