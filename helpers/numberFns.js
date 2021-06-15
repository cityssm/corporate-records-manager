export const ensureInteger = (possibleNumber) => {
    if (typeof (possibleNumber) === "number") {
        return possibleNumber;
    }
    return parseInt(possibleNumber, 10);
};
