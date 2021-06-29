import { getReportData } from "../../helpers/recordsDB/getReportData.js";
import Papa from "papaparse";
export const handler = async (request, response) => {
    const reportName = request.params.reportName;
    const reportData = await getReportData(reportName, request.query);
    const csv = Papa.unparse(reportData);
    response.setHeader("Content-Disposition", "attachment; filename=" + (reportName.replace(/:/g, "-")) + "-" + Date.now().toString() + ".csv");
    response.setHeader("Content-Type", "text/csv");
    response.send(csv);
};
export default handler;
