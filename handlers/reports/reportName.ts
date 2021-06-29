import type { RequestHandler } from "express";

import { getReportData } from "../../helpers/recordsDB/getReportData.js";

import Papa from "papaparse";


export const handler: RequestHandler = async (request, response) => {

  const reportName = request.params.reportName;

  const reportData = await getReportData(reportName, request.query);

  // eslint-disable-next-line @typescript-eslint/ban-types
  const csv = Papa.unparse(reportData as object[]);

  response.setHeader("Content-Disposition",
    "attachment; filename=" + (reportName.replace(/:/g, "-")) + "-" + Date.now().toString() + ".csv");

  response.setHeader("Content-Type", "text/csv");

  response.send(csv);
};


export default handler;
