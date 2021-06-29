import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import reportDefinitions from "../../data/reports.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getReportData");
export const getReportData = async (reportName, parameters = {}) => {
    const reportDefinition = reportDefinitions[reportName];
    if (!reportDefinition) {
        return [];
    }
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        let request = pool.request();
        for (const parameterName of (reportDefinition.paramNames || [])) {
            request = request.input(parameterName, parameters[parameterName]);
        }
        const result = await request.query(reportDefinition.sql());
        if (!result.recordset || result.recordset.length === 0) {
            return [];
        }
        return result.recordset;
    }
    catch (error) {
        debugSQL(error);
    }
};
export default getReportData;
