import cleanupRecordsTable from "../../helpers/recordsDB/cleanupRecordsTable.js";
import cleanupRecordTagsTable from "../../helpers/recordsDB/cleanupRecordTagsTable.js";
import cleanupRelatedRecordsTable from "../../helpers/recordsDB/cleanupRelatedRecordsTable.js";
import { cleanupRecordStatusLogTable, cleanupRecordURLsTable, cleanupRecordCommentLogTable } from "../../helpers/recordsDB/cleanupTable.js";
export const handler = async (req, res) => {
    const tableName = req.body.tableName;
    let recordCount = 0;
    switch (tableName) {
        case "Records":
            recordCount = await cleanupRecordsTable();
            break;
        case "RecordTags":
            recordCount = await cleanupRecordTagsTable();
            break;
        case "RecordStatusLog":
            recordCount = await cleanupRecordStatusLogTable();
            break;
        case "RecordURLs":
            recordCount = await cleanupRecordURLsTable();
            break;
        case "RelatedRecords":
            recordCount = await cleanupRelatedRecordsTable();
            break;
        case "RecordCommentLog":
            recordCount = await cleanupRecordCommentLogTable();
            break;
        default:
            return res.json({
                success: false,
                message: "Invalid tableName = " + tableName
            });
    }
    return res.json({
        success: true,
        recordCount
    });
};
export default handler;
