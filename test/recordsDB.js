import * as assert from "assert";
import * as pool from "@cityssm/mssql-multi-pool";
import { getRecord } from "../helpers/recordsDB/getRecord.js";
import { getRecordComments } from "../helpers/recordsDB/getRecordComments.js";
import { getRecordStatuses } from "../helpers/recordsDB/getRecordStatuses.js";
import { getRecordTags } from "../helpers/recordsDB/getRecordTags.js";
import { getRecordURLs } from "../helpers/recordsDB/getRecordURLs.js";
import { getRelatedRecords } from "../helpers/recordsDB/getRelatedRecords.js";
import { getRecords } from "../helpers/recordsDB/getRecords.js";
import { getReportData } from "../helpers/recordsDB/getReportData.js";
import { reports } from "../data/reports.js";
const requestSession = {
    user: {
        userName: "test.user",
        fullName: "Test User",
        canViewAll: true,
        canUpdate: false,
        isAdmin: false
    }
};
describe("recordsDB - getRecord()", () => {
    after(async () => {
        pool.releaseAll();
    });
    it("should execute getRecord()", async () => {
        return await getRecord(1, requestSession);
    });
    it("should execute getRecordComments()", async () => {
        return await getRecordComments(1);
    });
    it("should execute getRecordStatuses()", async () => {
        return await getRecordStatuses(1);
    });
    it("should execute getRecordTags()", async () => {
        return await getRecordTags(1);
    });
    it("should execute getRecordURLs()", async () => {
        return await getRecordURLs(1);
    });
    it("should execute getRelatedRecords()", async () => {
        return await getRelatedRecords(1);
    });
});
describe("recordsDB - getRecords()", () => {
    after(async () => {
        pool.releaseAll();
    });
    const limitOffset = {
        limit: 10,
        offset: 0
    };
    it("has no filters", async () => {
        const records = await getRecords({
            recordTypeKey: "",
            searchString: ""
        }, limitOffset, requestSession);
        assert.strictEqual(typeof (records), "object");
    });
    it("filters by recordTypeKey", async () => {
        const records = await getRecords({
            recordTypeKey: "bylaw",
            searchString: ""
        }, limitOffset, requestSession);
        assert.strictEqual(typeof (records), "object");
    });
    it("filters by searchString", async () => {
        const records = await getRecords({
            recordTypeKey: "",
            searchString: "yard maintenance"
        }, limitOffset, requestSession);
        assert.strictEqual(typeof (records), "object");
    });
    it("filters by recordNumber", async () => {
        const records = await getRecords({
            recordTypeKey: "",
            searchString: "",
            recordNumber: "00-001"
        }, limitOffset, requestSession);
        assert.strictEqual(typeof (records), "object");
    });
    it("filters by recordTag", async () => {
        const records = await getRecords({
            recordTypeKey: "",
            recordTag: "agreement",
            searchString: ""
        }, limitOffset, requestSession);
        assert.strictEqual(typeof (records), "object");
    });
    it("filters by recordDateStringGTE", async () => {
        const records = await getRecords({
            recordTypeKey: "",
            searchString: "",
            recordDateStringGTE: "2010-01-01"
        }, limitOffset, requestSession);
        assert.strictEqual(typeof (records), "object");
    });
    it("filters by recordDateStringLTE", async () => {
        const records = await getRecords({
            recordTypeKey: "",
            searchString: "",
            recordDateStringLTE: "2010-01-01"
        }, limitOffset, requestSession);
        assert.strictEqual(typeof (records), "object");
    });
});
describe("recordsDB - getReportData()", () => {
    const parameters = {
        recordTypeKey: "bylaw"
    };
    after(async () => {
        pool.releaseAll();
    });
    for (const reportName of Object.getOwnPropertyNames(reports)) {
        it("should execute report " + reportName, async () => {
            const results = await getReportData(reportName, parameters);
            assert.strictEqual(typeof (results), "object");
        });
    }
});
