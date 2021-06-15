#!/usr/bin/env node

import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../helpers/configFns.js";

import addRelatedRecord from "../helpers/recordsDB/addRelatedRecord.js";

import type * as sqlTypes from "mssql";


const SQL_createRecord = "insert into CR.Records" +
  " (recordTypeKey, recordNumber," +
  " recordTitle, recordDescription, party, location," +
  " recordDate," +
  " recordCreate_userName, recordCreate_datetime," +
  " recordUpdate_userName, recordUpdate_datetime," +
  " recordDelete_userName, recordDelete_datetime)" +
  " output inserted.recordID" +
  " values (@recordTypeKey, @recordNumber, @recordTitle, @recordDescription," +
  " @party, @location," +
  " @recordDate," +
  " @recordCreate_userName, @recordCreate_datetime," +
  " @recordUpdate_userName, @recordUpdate_datetime," +
  " @recordDelete_userName, @recordDelete_datetime)";

const SQL_createTag = "insert into CR.RecordTags" +
  " (recordID, tag)" +
  " values (@recordID, @tag)";

const SQL_createStatus = "insert into CR.RecordStatusLog" +
  " (recordID, statusTime, statusTypeKey, statusLog," +
  " recordCreate_userName, recordCreate_datetime," +
  " recordUpdate_userName, recordUpdate_datetime)" +
  " values (@recordID, @statusTime, @statusTypeKey, @statusLog," +
  " @recordCreate_userName, @recordCreate_datetime," +
  " @recordUpdate_userName, @recordUpdate_datetime)";

const SQL_createComment = "insert into CR.RecordCommentLog" +
  " (recordID, commentTime, comment," +
  " recordCreate_userName, recordCreate_datetime," +
  " recordUpdate_userName, recordUpdate_datetime," +
  " recordDelete_userName, recordDelete_datetime)" +
  " values (@recordID, @commentTime, @comment," +
  " @recordCreate_userName, @recordCreate_datetime," +
  " @recordUpdate_userName, @recordUpdate_datetime," +
  " @recordDelete_userName, @recordDelete_datetime)";


const oldBylawToRecord = new Map<number, number>();


const doTablePurge = async () => {

  try {
    // Connect to Database
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    // Purge Destination Tables

    const tablesToPurge = ["CR.RecordCommentLog", "CR.RecordStatusLog",
      "CR.RecordTags", "CR.RecordURLs", "CR.RelatedRecords",
      "CR.Records", "CR.StatusTypes"];

    for (const tableName of tablesToPurge) {

      await pool.request()
        .query("delete from " + tableName);
    }
  } catch (e) {
    console.log(e);
  }
};


const doTableCleanup = async () => {

  try {
    // Connect to Database
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    // Remove time
    await pool.request()
      .query("update CR.Records" +
        " set recordDate = cast(convert(varchar(10), recordDate, 111) as datetime)");

  } catch (e) {
    console.log(e);
  }
};


const doImportBylaws = async () => {

  try {
    // Connect to Database
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    // Get Old Bylaws

    console.log("Bylaws");

    const oldBylaws: LegacyBylaw[] = (await pool.request()
      .query("select bylawID, bylawNumber," +
        " c.category, description," +
        " creator, creationTime," +
        " b.isActive" +
        " from ByLaw.ByLaws b" +
        " left join ByLawConfig.Categories c on b.categoryID = c.categoryID")).recordset;

    for (const oldBylaw of oldBylaws) {

      const recordID = (await pool.request()
        .input("recordTypeKey", "bylaw")
        .input("recordNumber", oldBylaw.bylawNumber)
        .input("recordTitle", oldBylaw.bylawNumber)
        .input("recordDescription", oldBylaw.description)
        .input("party", "")
        .input("location", "")
        .input("recordDate", oldBylaw.creationTime)
        .input("recordCreate_userName", oldBylaw.creator)
        .input("recordCreate_datetime", oldBylaw.creationTime)
        .input("recordUpdate_userName", oldBylaw.creator)
        .input("recordUpdate_datetime", oldBylaw.creationTime)
        .input("recordDelete_userName", oldBylaw.isActive ? null : "import")
        .input("recordDelete_datetime", oldBylaw.isActive ? null : new Date())
        .query(SQL_createRecord)).recordset[0].recordID;

      oldBylawToRecord.set(oldBylaw.bylawID, recordID);

      await pool.request()
        .input("recordID", recordID)
        .input("tag", oldBylaw.category)
        .query(SQL_createTag);
    }

    console.log("Bylaw Statuses");

    const bylawStatuses = new Set<string>();

    const oldBylawStatuses: LegacyBylawStatus[] = (await pool.request()
      .query("select bylawID," +
        " s.status, s.isActive as statusIsActive," +
        " coalesce(updateDate, creationTime) as statusDate," +
        " note, creator, creationTime" +
        " from ByLaw.StatusUpdates u" +
        " left join ByLawConfig.Statuses s on u.statusID = s.statusID")).recordset;

    for (const oldStatus of oldBylawStatuses) {

      const statusTypeKey = "bylaw-" + oldStatus.status.trim().toLowerCase().replace(/ /g, "_");

      if (!bylawStatuses.has(statusTypeKey)) {

        await pool.request()
          .input("statusTypeKey", statusTypeKey)
          .input("recordTypeKey", "bylaw")
          .input("statusType", oldStatus.status.trim())
          .input("isActive", oldStatus.statusIsActive)
          .input("orderNumber", 0)
          .query("insert into CR.StatusTypes" +
            " (statusTypeKey, recordTypeKey, statusType, isActive, orderNumber)" +
            " values (@statusTypeKey, @recordTypeKey, @statusType, @isActive, @orderNumber)");

        bylawStatuses.add(statusTypeKey);
      }

      const recordID = oldBylawToRecord.get(oldStatus.bylawID);

      await pool.request()
        .input("recordID", recordID)
        .input("statusTime", oldStatus.statusDate)
        .input("statusTypeKey", statusTypeKey)
        .input("statusLog", oldStatus.note)
        .input("recordCreate_userName", oldStatus.creator)
        .input("recordCreate_datetime", oldStatus.creationTime)
        .input("recordUpdate_userName", oldStatus.creator)
        .input("recordUpdate_datetime", oldStatus.creationTime)
        .query(SQL_createStatus);

      await pool.request()
        .input("recordDate", oldStatus.statusDate)
        .input("recordID", recordID)
        .query("update CR.Records" +
          " set recordDate = @recordDate" +
          " where recordID = @recordID" +
          " and recordDate > @recordDate");
    }

    console.log("Related Bylaws");

    const oldRelatedBylaws: LegacyRelatedBylaw[] = (await pool.request()
      .query("select bylawIDA, bylawIDB" +
        " from ByLaw.RelatedBylaws")).recordset;

    for (const oldRelated of oldRelatedBylaws) {

      const recordIDA = oldBylawToRecord.get(oldRelated.bylawIDA);
      const recordIDB = oldBylawToRecord.get(oldRelated.bylawIDB);

      await addRelatedRecord(recordIDA, recordIDB);
    }

    console.log("Done Bylaws");

  } catch (e) {
    console.log(e);
  }
};


const doImportAgreements = async () => {

  try {
    // Connect to Database
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    // Get Old Bylaws

    const oldAgreementToRecord = new Map<number, number>();

    console.log("Agreements");

    const oldAgreements: LegacyAgreement[] = (await pool.request()
      .query("select agreementID, agreementNumber, agreementDate," +
        " t.type as agreementType," +
        " party, description, location," +
        " creator, creationTime," +
        " a.isActive" +
        " from Agreement.Agreements a" +
        " left join AgreementConfig.Types t on a.typeID = t.typeID")).recordset;

    for (const oldAgreement of oldAgreements) {

      const recordID = (await pool.request()
        .input("recordTypeKey", "agreement")
        .input("recordNumber", oldAgreement.agreementNumber)
        .input("recordTitle", oldAgreement.agreementNumber)
        .input("recordDescription", oldAgreement.description)
        .input("party", oldAgreement.party || "")
        .input("location", oldAgreement.location || "")
        .input("recordDate", oldAgreement.agreementDate)
        .input("recordCreate_userName", oldAgreement.creator)
        .input("recordCreate_datetime", oldAgreement.creationTime)
        .input("recordUpdate_userName", oldAgreement.creator)
        .input("recordUpdate_datetime", oldAgreement.creationTime)
        .input("recordDelete_userName", oldAgreement.isActive ? null : "import")
        .input("recordDelete_datetime", oldAgreement.isActive ? null : new Date())
        .query(SQL_createRecord)).recordset[0].recordID;

      oldAgreementToRecord.set(oldAgreement.agreementID, recordID);

      await pool.request()
        .input("recordID", recordID)
        .input("tag", oldAgreement.agreementType)
        .query(SQL_createTag);
    }

    console.log("Agreement Instrument Numbers");

    const oldInstrumentNumbers: LegacyAgreementInstrumentNumber[] = (await pool.request()
      .query("select agreementID, instrumentNumber" +
        " from Agreement.InstrumentNumbers")).recordset;

    for (const instrumentNumber of oldInstrumentNumbers) {

      const recordID = oldAgreementToRecord.get(instrumentNumber.agreementID);

      await pool.request()
        .input("recordID", recordID)
        .input("tag", instrumentNumber.instrumentNumber)
        .query(SQL_createTag);
    }

    console.log("Agreement Comments");

    const oldAgreementComments: LegacyAgreementComment[] = (await pool.request()
      .query("select agreementID," +
        " commentor, commentTime, comment, isActive" +
        " from Agreement.Comments")).recordset;

    for (const oldComment of oldAgreementComments) {

      const recordID = oldAgreementToRecord.get(oldComment.agreementID);

      await pool.request()
        .input("recordID", recordID)
        .input("commentTime", oldComment.commentTime)
        .input("comment", oldComment.comment)
        .input("recordCreate_userName", oldComment.commentor)
        .input("recordCreate_datetime", oldComment.commentTime)
        .input("recordUpdate_userName", oldComment.commentor)
        .input("recordUpdate_datetime", oldComment.commentTime)
        .input("recordDelete_userName", oldComment.isActive ? null : "import")
        .input("recordDelete_datetime", oldComment.isActive ? null : new Date())
        .query(SQL_createComment);
    }

    console.log("Related Bylaws");

    const oldRelatedBylaws: LegacyRelatedAgreement[] = (await pool.request()
      .query("select agreementID, bylawID" +
        " from Agreement.RelatedBylaws")).recordset;

    for (const oldRelated of oldRelatedBylaws) {

      const recordIDA = oldBylawToRecord.get(oldRelated.bylawID);
      const recordIDB = oldAgreementToRecord.get(oldRelated.agreementID);

      await addRelatedRecord(recordIDA, recordIDB);
    }

    console.log("Done Agreements");

  } catch (e) {
    console.log(e);
  }
};


const doImportDeeds = async () => {

  try {
    // Connect to Database
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    // Get Old Bylaws

    const oldDeedToRecord = new Map<number, number>();

    console.log("Deeds");

    const oldDeeds: LegacyDeed[] = (await pool.request()
      .query("select deedID, clerkNumber, deedDate," +
        " t.type as deedType," +
        " transferor, description," +
        " creator, creationTime," +
        " d.isActive" +
        " from Deed.Deeds d" +
        " left join DeedConfig.Types t on d.typeID = t.typeID")).recordset;

    for (const oldDeed of oldDeeds) {

      const recordID = (await pool.request()
        .input("recordTypeKey", "deed")
        .input("recordNumber", oldDeed.clerkNumber.toString())
        .input("recordTitle", oldDeed.clerkNumber.toString())
        .input("recordDescription", oldDeed.description)
        .input("party", oldDeed.transferor || "")
        .input("location", "")
        .input("recordDate", oldDeed.deedDate)
        .input("recordCreate_userName", oldDeed.creator)
        .input("recordCreate_datetime", oldDeed.creationTime)
        .input("recordUpdate_userName", oldDeed.creator)
        .input("recordUpdate_datetime", oldDeed.creationTime)
        .input("recordDelete_userName", oldDeed.isActive ? null : "import")
        .input("recordDelete_datetime", oldDeed.isActive ? null : new Date())
        .query(SQL_createRecord)).recordset[0].recordID;

      oldDeedToRecord.set(oldDeed.deedID, recordID);

      await pool.request()
        .input("recordID", recordID)
        .input("tag", oldDeed.deedType)
        .query(SQL_createTag);
    }

    console.log("Deed Instrument Numbers");

    const oldInstrumentNumbers: LegacyDeedInstrumentNumber[] = (await pool.request()
      .query("select deedID, instrumentNumber" +
        " from Deed.InstrumentNumbers")).recordset;

    for (const instrumentNumber of oldInstrumentNumbers) {

      const recordID = oldDeedToRecord.get(instrumentNumber.deedID);

      await pool.request()
        .input("recordID", recordID)
        .input("tag", instrumentNumber.instrumentNumber)
        .query(SQL_createTag);
    }

    console.log("Related Bylaws");

    const oldRelatedBylaws: LegacyRelatedDeed[] = (await pool.request()
      .query("select deedID, bylawID" +
        " from Deed.RelatedBylaws")).recordset;

    for (const oldRelated of oldRelatedBylaws) {

      const recordIDA = oldBylawToRecord.get(oldRelated.bylawID);
      const recordIDB = oldDeedToRecord.get(oldRelated.deedID);

      await addRelatedRecord(recordIDA, recordIDB);
    }

    console.log("Done Deeds");

  } catch (e) {
    console.log(e);
  }
};


const doImportEasements = async () => {

  try {
    // Connect to Database
    const pool: sqlTypes.ConnectionPool =
      await sqlPool.connect(configFns.getProperty("mssqlConfig"));

    // Get Old Bylaws

    const oldEasementToRecord = new Map<number, number>();

    console.log("Easements");

    const oldEasements: LegacyEasement[] = (await pool.request()
      .query("select easementID, clerkNumber, registrationDate," +
        " t.type as easementType," +
        " transferor, description, location," +
        " creator, creationTime," +
        " e.isActive" +
        " from Easement.Easements e" +
        " left join EasementConfig.Types t on e.typeID = t.typeID")).recordset;

    for (const oldEasement of oldEasements) {

      const recordID = (await pool.request()
        .input("recordTypeKey", "easement")
        .input("recordNumber", oldEasement.clerkNumber.toString())
        .input("recordTitle", oldEasement.clerkNumber.toString())
        .input("recordDescription", oldEasement.description)
        .input("party", oldEasement.transferor || "")
        .input("location", oldEasement.location || "")
        .input("recordDate", oldEasement.registrationDate)
        .input("recordCreate_userName", oldEasement.creator)
        .input("recordCreate_datetime", oldEasement.creationTime)
        .input("recordUpdate_userName", oldEasement.creator)
        .input("recordUpdate_datetime", oldEasement.creationTime)
        .input("recordDelete_userName", oldEasement.isActive ? null : "import")
        .input("recordDelete_datetime", oldEasement.isActive ? null : new Date())
        .query(SQL_createRecord)).recordset[0].recordID;

      oldEasementToRecord.set(oldEasement.easementID, recordID);

      await pool.request()
        .input("recordID", recordID)
        .input("tag", oldEasement.easementType)
        .query(SQL_createTag);
    }

    console.log("Easement Instrument Numbers");

    const oldInstrumentNumbers: LegacyEasementInstrumentNumber[] = (await pool.request()
      .query("select easementID, instrumentNumber" +
        " from Easement.InstrumentNumbers")).recordset;

    for (const instrumentNumber of oldInstrumentNumbers) {

      const recordID = oldEasementToRecord.get(instrumentNumber.easementID);

      await pool.request()
        .input("recordID", recordID)
        .input("tag", instrumentNumber.instrumentNumber)
        .query(SQL_createTag);
    }

    console.log("Done Easements");

  } catch (e) {
    console.log(e);
  }
};


interface LegacyBylaw {
  bylawID: number;
  bylawNumber: string;
  category: string;
  description: string;
  creator: string;
  creationTime: Date;
  isActive: boolean;
}

interface LegacyBylawStatus {
  bylawID: number;
  status: string;
  statusIsActive: boolean;
  statusDate: string;
  note: string;
  creator: string;
  creationTime: Date;
}

interface LegacyRelatedBylaw {
  bylawIDA: number;
  bylawIDB: number;
}


interface LegacyAgreement {
  agreementID: number;
  agreementNumber: string;
  agreementDate: Date;
  agreementType: string;
  party: string;
  description: string;
  location?: string;
  creator: string;
  creationTime: Date;
  isActive: boolean;
}

interface LegacyAgreementInstrumentNumber {
  agreementID: number;
  instrumentNumber: string;
}

interface LegacyAgreementComment {
  agreementID: number;
  commentor: string;
  commentTime: Date;
  comment: string;
  isActive: boolean;
}

interface LegacyRelatedAgreement {
  agreementID: number;
  bylawID: number;
}

interface LegacyDeed {
  deedID: number;
  clerkNumber: number;
  deedDate: Date;
  deedType: string;
  transferor: string;
  description: string;
  creator: string;
  creationTime: Date;
  isActive: boolean;
}

interface LegacyDeedInstrumentNumber {
  deedID: number;
  instrumentNumber: string;
}

interface LegacyRelatedDeed {
  deedID: number;
  bylawID: number;
}

interface LegacyEasement {
  easementID: number;
  clerkNumber: number;
  registrationDate: Date;
  easementType: string;
  transferor: string;
  description: string;
  location: string;
  creator: string;
  creationTime: Date;
  isActive: boolean;
}

interface LegacyEasementInstrumentNumber {
  easementID: number;
  instrumentNumber: string;
}

console.log("Import Disabled");

/*
await doTablePurge();
await doImportBylaws();
await doImportDeeds();
await doImportEasements();
await doImportAgreements();
await doTableCleanup();

console.log("Done");
*/

process.exit();
