import type { RequestHandler } from "express";

import getReportData from "../../helpers/recordsDB/getReportData.js";

import Papa from "papaparse";


export const handler: RequestHandler = async (req, res) => {

  const reportName = req.params.reportName;

  const reportData = await getReportData(reportName, req.query);

  const csv = Papa.unparse(reportData);

  res.setHeader("Content-Disposition",
    "attachment; filename=" + (reportName.replace(/:/g, "-")) + "-" + Date.now().toString() + ".csv");

  res.setHeader("Content-Type", "text/csv");

  res.send(csv);
};


export default handler;
