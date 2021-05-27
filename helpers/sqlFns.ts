const sanitizeWherePiece = (unsanitizedString: string) => {

  const sanitizedString = unsanitizedString
    .replace(/\[/g, "[[]")
    .replace(/_/g, "[_]")
    .replace(/%/g, "[%]")
    .replace(/'/g, "''");

  return sanitizedString;
};


export const buildWhereClauseLike = (columnNames: string[], queryString: string) => {

  let whereClause = "";

  const queryStringArray = queryString.split(" ");

  for (const queryStringPiece of queryStringArray) {

    if (queryStringPiece === "") {
      continue;
    }

    let stringWhere = "";

    for (const columnName of columnNames) {

      stringWhere += (stringWhere === "" ? "" : " or ") +
        columnName + " like '%" + sanitizeWherePiece(queryStringPiece) + "%'";
    }

    if (columnNames.length > 1) {
      stringWhere = "(" + stringWhere + ")";
    }

    whereClause += (whereClause === "" ? "" : " and ") + stringWhere;
  }

  return whereClause;
};
