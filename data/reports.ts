import type { ReportDefinition } from "../types/configTypes";


export const reports: { [reportName: string]: ReportDefinition } = {

  "records:byRecordTypeKey": {
    sql: () => {
      return "select r.recordID, r.recordNumber," +
        " convert(char(10), r.recordDate, 23) as recordDate," +
        " r.recordTitle, r.recordDescription," +
        " t.tagCSV" +
        " from CR.Records r" +
        " left join CR.RecordTagCSV t on r.recordID = t.recordID" +
        " where r.recordDelete_datetime is null" +
        " and r.recordTypeKey = @recordTypeKey" +
        " order by r.recordID";
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
