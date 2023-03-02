import dayjs from "dayjs";
export const dataOne = (test, first, second) => {
  if (test) {
    return first;
  } else {
    return second;
  }
};
export const oneDay = dayjs().subtract(1, "day").format("YYYY-MM-DD");

/* ------------------------------------ x ----------------------------------- */
export const oneMonth = dayjs().subtract(2, "month").format("YYYY-MM-DD");
/* ------------------------------------ x ----------------------------------- */
export const threeMonth = dayjs().subtract(3, "month").format("YYYY-MM-DD");
/* ------------------------------------ x ----------------------------------- */
export const oneYear = dayjs().subtract(1, "year").format("YYYY-MM-DD");
/* ------------------------------------ x ----------------------------------- */
export const fiveYears = dayjs().subtract(5, "year").format("YYYY-MM-DD");
