import type { ReportDefinition } from "../types/configTypes";


export const reports: { [reportName: string]: ReportDefinition } = {

  "records:byRecordTypeKey": {
    sql: () => {
      return "select r.recordID, r.recordNumber," +
        " convert(char(10), r.recordDate, 23) as recordDate," +
        " r.recordTitle, r.recordDescription," +
        " r.party, r.location," +
        " t.tagCSV," +
        " s.statusTypeKey, s.statusType," +
        " convert(char(10), s.statusTime, 23) as statusDate" +
        " from CR.Records r" +
        " left join CR.RecordTagCSV t on r.recordID = t.recordID" +
        " outer apply (" +
        "select top 1 s.statusTime, s.statusTypeKey, t.statusType" +
        " from CR.RecordStatusLog s" +
        " left join CR.StatusTypes t on s.statusTypeKey = t.statusTypeKey" +
        " where r.recordID = s.recordID" +
        " and recordDelete_datetime is null" +
        " order by statusTime desc, statusLogID desc) s" +
        " where r.recordDelete_datetime is null" +
        " and r.recordTypeKey = @recordTypeKey" +
        " order by r.recordID";
    },
    paramNames: ["recordTypeKey"]
  },

  recordTypes: {
    sql: () => {
      return "select t.recordType," +
        " year(r.recordDate) as recordYear," +
        " sum(case when month(r.recordDate) = 1 then 1 else 0 end) as recordCount_jan," +
        " sum(case when month(r.recordDate) = 2 then 1 else 0 end) as recordCount_feb," +
        " sum(case when month(r.recordDate) = 3 then 1 else 0 end) as recordCount_mar," +
        " sum(case when month(r.recordDate) = 4 then 1 else 0 end) as recordCount_apr," +
        " sum(case when month(r.recordDate) = 5 then 1 else 0 end) as recordCount_may," +
        " sum(case when month(r.recordDate) = 6 then 1 else 0 end) as recordCount_jun," +
        " sum(case when month(r.recordDate) = 7 then 1 else 0 end) as recordCount_jul," +
        " sum(case when month(r.recordDate) = 8 then 1 else 0 end) as recordCount_aug," +
        " sum(case when month(r.recordDate) = 9 then 1 else 0 end) as recordCount_sep," +
        " sum(case when month(r.recordDate) = 10 then 1 else 0 end) as recordCount_oct," +
        " sum(case when month(r.recordDate) = 11 then 1 else 0 end) as recordCount_nov," +
        " sum(case when month(r.recordDate) = 12 then 1 else 0 end) as recordCount_dec," +
        " count(recordID) as recordCount" +
        " from CR.RecordTypes t" +
        " left join CR.Records r on t.recordTypeKey = r.recordTypeKey" +
        " where t.isActive = 1" +
        " and r.recordDelete_datetime is null" +
        " group by t.recordType, year(r.recordDate)" +
        " order by t.recordType, recordYear";
    }
  },

  "table:Records": {
    sql: () => {
      return "select recordID, recordTypeKey, recordNumber, recordDate," +
        " recordTitle, recordDescription, party, location," +
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
  "table:RecordUsers": {
    sql: () => {
      return "select recordUserID, recordID, userName, recordUserTypeKey," +
        " recordCreate_userName, recordCreate_datetime," +
        " recordUpdate_userName, recordUpdate_datetime," +
        " recordDelete_userName, recordDelete_datetime" +
        " from CR.RecordUsers";
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
