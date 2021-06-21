import * as assert from "assert";
import { getRecords } from "../helpers/recordsDB/getRecords.js";
import { getRecord } from "../helpers/recordsDB/getRecord.js";
describe("recordsDB", () => {
    it("should execute getRecord()", async () => {
        await getRecord(1);
        assert.ok(1);
    });
});
describe("recordsDB - getRecords()", () => {
    const limitOffset = {
        limit: 10,
        offset: 0
    };
    it("has no filters", async () => {
        const records = await getRecords({
            recordTypeKey: "",
            searchString: ""
        }, limitOffset);
        assert.strictEqual(typeof (records), "object");
    });
    it("filters by recordTypeKey", async () => {
        const records = await getRecords({
            recordTypeKey: "bylaw",
            searchString: ""
        }, limitOffset);
        assert.strictEqual(typeof (records), "object");
    });
    it("filters by searchString", async () => {
        const records = await getRecords({
            recordTypeKey: "",
            searchString: "yard maintenance"
        }, limitOffset);
        assert.strictEqual(typeof (records), "object");
    });
    it("filters by recordNumber", async () => {
        const records = await getRecords({
            recordTypeKey: "",
            searchString: "",
            recordNumber: "00-001"
        }, limitOffset);
        assert.strictEqual(typeof (records), "object");
    });
    it("filters by recordDateStringGTE", async () => {
        const records = await getRecords({
            recordTypeKey: "",
            searchString: "",
            recordDateStringGTE: "2010-01-01"
        }, limitOffset);
        assert.strictEqual(typeof (records), "object");
    });
    it("filters by recordDateStringLTE", async () => {
        const records = await getRecords({
            recordTypeKey: "",
            searchString: "",
            recordDateStringLTE: "2010-01-01"
        }, limitOffset);
        assert.strictEqual(typeof (records), "object");
    });
});
