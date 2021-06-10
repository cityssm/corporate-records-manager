export const reports = {
    "records:byRecordTypeKey": {
        sql: () => {
            return "select recordID, recordNumber, convert(char(10), recordDate, 23) as recordDate," +
                " recordTitle, recordDescription" +
                " from CR.Records" +
                " where recordDelete_datetime is null" +
                " and recordTypeKey = @recordTypeKey" +
                " order by recordID";
        },
        paramNames: ["recordTypeKey"]
    },
    "table:Records": {
        sql: () => {
            return "select recordID, recordTypeKey, recordNumber, recordDate," +
                " recordTitle, recordDescription," +
                " recordCreate_userName, recordCreate_datetime," +
                " recordUpdate_userName, recordUpdate_datetime," +
                " recordDelete_userName, recordDelete_datetime" +
                " from CR.Records";
        }
    },
    "table:RecordTags": {
        sql: () => {
            return "select recordID, tag" +
                " from CR.RecordTags";
        }
    },
    "table:RecordStatusLog": {
        sql: () => {
            return "select statusLogID, recordID, statusTime, statusTypeKey, statusLog," +
                " recordCreate_userName, recordCreate_datetime," +
                " recordUpdate_userName, recordUpdate_datetime," +
                " recordDelete_userName, recordDelete_datetime" +
                " from CR.RecordStatusLog";
        }
    },
    "table:RecordURLs": {
        sql: () => {
            return "select urlID, recordID, url, urlTitle, urlDescription," +
                " recordCreate_userName, recordCreate_datetime," +
                " recordUpdate_userName, recordUpdate_datetime," +
                " recordDelete_userName, recordDelete_datetime" +
                " from CR.RecordURLs";
        }
    },
    "table:RelatedRecords": {
        sql: () => {
            return "select recordID_A, recordID_B" +
                " from CR.RelatedRecords";
        }
    },
    "table:RecordCommentLog": {
        sql: () => {
            return "select commentLogID, recordID, commentTime, comment," +
                " recordCreate_userName, recordCreate_datetime," +
                " recordUpdate_userName, recordUpdate_datetime," +
                " recordDelete_userName, recordDelete_datetime" +
                " from CR.RecordCommentLog";
        }
    }
};
export default reports;
