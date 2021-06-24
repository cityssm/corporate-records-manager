import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../configFns.js";
import setStatusTypeOrderNumber from "./setStatusTypeOrderNumber.js";
import debug from "debug";
const debugSQL = debug("corporate-records-manager:recordsDB:getAllStatusTypes");
export const getAllStatusTypes = async () => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        const result = await pool.request()
            .query("select t.statusTypeKey, t.statusType, t.recordTypeKey, t.orderNumber, t.isActive," +
            " count(statusLogID) as recordCount" +
            " from CR.StatusTypes t" +
            " left join CR.RecordStatusLog l on t.statusTypeKey = l.statusTypeKey" +
            " group by t.statusTypeKey, t.statusType, t.recordTypeKey, t.orderNumber, t.isActive" +
            " order by t.recordTypeKey, t.orderNumber, t.statusType");
        const statusTypes = result.recordset;
        let currentRecordTypeKey = "";
        let expectedOrderNumber = 0;
        for (const statusType of statusTypes) {
            if (statusType.recordTypeKey !== currentRecordTypeKey) {
                currentRecordTypeKey = statusType.recordTypeKey;
                expectedOrderNumber = 0;
            }
            else {
                expectedOrderNumber += 1;
            }
            if (statusType.orderNumber !== expectedOrderNumber) {
                await setStatusTypeOrderNumber(statusType.statusTypeKey, expectedOrderNumber);
                statusType.orderNumber = expectedOrderNumber;
            }
        }
        return statusTypes;
    }
    catch (e) {
        debugSQL(e);
    }
    return [];
};
export default getAllStatusTypes;
