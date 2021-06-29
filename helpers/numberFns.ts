export const ensureInteger = (possibleNumber: number | string): number => {

  if (typeof (possibleNumber) === "number") {
    return possibleNumber;
  }

  return Number.parseInt(possibleNumber, 10);
};
