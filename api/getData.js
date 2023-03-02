export const getData = async (base) => {
  const res = await fetch(
    `https://api.exchangerate.host/latest?base=${String(
      base || "EGP"
    ).toUpperCase()}`
  );
  return res.json();
};
