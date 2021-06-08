#!/usr/bin/env node
import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as configFns from "../helpers/configFns.js";
import addRelatedRecord from "../helpers/recordsDB/addRelatedRecord.js";
const SQL_createRecord = "insert into CR.Records" +
    " (recordTypeKey, recordNumber," +
    " recordTitle, recordDescription, recordDate," +
    " recordCreate_userName, recordCreate_datetime," +
    " recordUpdate_userName, recordUpdate_datetime," +
    " recordDelete_userName, recordDelete_datetime)" +
    " output inserted.recordID" +
    " values (@recordTypeKey, @recordNumber, @recordTitle, @recordDescription, @recordDate," +
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
const oldBylawToRecord = new Map();
const doTablePurge = async () => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        const tablesToPurge = ["CR.RecordCommentLog", "CR.RecordStatusLog",
            "CR.RecordTags", "CR.RecordURLs", "CR.RelatedRecords",
            "CR.Records", "CR.StatusTypes"];
        for (const tableName of tablesToPurge) {
            await pool.request()
                .query("delete from " + tableName);
        }
    }
    catch (e) {
        console.log(e);
    }
};
const doImportBylaws = async () => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        console.log("Bylaws");
        const oldBylaws = (await pool.request()
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
        const bylawStatuses = new Set();
        const oldBylawStatuses = (await pool.request()
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
            if (statusTypeKey === "bylaw-new") {
                await pool.request()
                    .input("recordDate", oldStatus.statusDate)
                    .input("recordID", recordID)
                    .query("update CR.Records" +
                    " set recordDate = @recordDate" +
                    " where recordID = @recordID");
            }
        }
        console.log("Related Bylaws");
        const oldRelatedBylaws = (await pool.request()
            .query("select bylawIDA, bylawIDB" +
            " from ByLaw.RelatedBylaws")).recordset;
        for (const oldRelated of oldRelatedBylaws) {
            const recordIDA = oldBylawToRecord.get(oldRelated.bylawIDA);
            const recordIDB = oldBylawToRecord.get(oldRelated.bylawIDB);
            await addRelatedRecord(recordIDA, recordIDB);
        }
        console.log("Done Bylaws");
    }
    catch (e) {
        console.log(e);
    }
};
const doImportAgreements = async () => {
    try {
        const pool = await sqlPool.connect(configFns.getProperty("mssqlConfig"));
        const oldAgreementToRecord = new Map();
        console.log("Agreements");
        const oldAgreements = (await pool.request()
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
                .input("recordTitle", oldAgreement.party)
                .input("recordDescription", oldAgreement.description +
                (oldAgreement.location && oldAgreement.location !== ""
                    ? "\nLoaction: " + oldAgreement.location
                    : ""))
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
        const oldInstrumentNumbers = (await pool.request()
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
        const oldAgreementComments = (await pool.request()
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
        const oldRelatedBylaws = (await pool.request()
            .query("select agreementID, bylawID" +
            " from Agreement.RelatedBylaws")).recordset;
        for (const oldRelated of oldRelatedBylaws) {
            const recordIDA = oldBylawToRecord.get(oldRelated.bylawID);
            const recordIDB = oldAgreementToRecord.get(oldRelated.agreementID);
            await addRelatedRecord(recordIDA, recordIDB);
        }
        console.log("Done Agreements");
    }
    catch (e) {
        console.log(e);
    }
};
await doTablePurge();
await doImportBylaws();
await doImportAgreements();
console.log("Done");
process.exit();
