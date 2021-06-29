export const ensureInteger = (possibleNumber) => {
    if (typeof (possibleNumber) === "number") {
        return possibleNumber;
    }
    return Number.parseInt(possibleNumber, 10);
};
