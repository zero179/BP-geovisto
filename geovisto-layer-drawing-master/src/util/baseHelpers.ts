/**
 * @author Andrej Tlcina
 */

/**
 * @brief is array or object empty
 */
export const isEmpty = <T>(obj: T): boolean => {
  return (
    typeof obj === "object" && obj !== null && Object.keys(obj).length === 0
  );
};

export const sortReverseAlpha = (a: number, b: number): 1 | 0 | -1 => {
  if (a < b) return 1;
  if (a > b) return -1;
  return 0;
};

export const sortAlpha = (a: number, b: number): 1 | 0 | -1 => {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

export const isInt = (n: number): boolean => Number(n) === n && n % 1 === 0;

export const isFloat = (n: number): boolean => Number(n) === n && n % 1 !== 0;

export const getIntervalStep = (n: number): number => {
  if (!n) return 0.0;
  const split = String(n).split(".");
  if (split.length === 2) {
    const after = split[1];
    const length = after.length - 1 < 0 ? 0 : after.length;
    const allZeros = [...Array(length)].join("0");

    if (length === 1) return 0.01;
    else if (length === 0) return 0.1;
    else return Number(`0.${allZeros}1`);
  }

  return 0.0;
};
