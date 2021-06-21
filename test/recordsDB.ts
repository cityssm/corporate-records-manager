import * as assert from "assert";

import { getRecord } from "../helpers/recordsDB/getRecord.js";
import { getRecordComments } from "../helpers/recordsDB/getRecordComments.js";
import { getRecordStatuses } from "../helpers/recordsDB/getRecordStatuses.js";
import { getRecordTags } from "../helpers/recordsDB/getRecordTags.js";
import { getRecordURLs } from "../helpers/recordsDB/getRecordURLs.js";
import { getRelatedRecords } from "../helpers/recordsDB/getRelatedRecords.js";

import { getRecords } from "../helpers/recordsDB/getRecords.js";


describe("recordsDB - getRecord()", () => {

  it("should execute getRecord()", async () => {
    await getRecord(1);
    assert.ok(1);
  });

  it("should execute getRecordComments()", async () => {
    const result = await getRecordComments(1);
    assert.ok(typeof (result), "object");
  });

  it("should execute getRecordStatuses()", async () => {
    const result = await getRecordStatuses(1);
    assert.ok(typeof (result), "object");
  });

  it("should execute getRecordTags()", async () => {
    const result = await getRecordTags(1);
    assert.ok(typeof (result), "object");
  });

  it("should execute getRecordURLs()", async () => {
    const result = await getRecordURLs(1);
    assert.ok(typeof (result), "object");
  });

  it("should execute getRelatedRecords()", async () => {
    const result = await getRelatedRecords(1);
    assert.ok(typeof (result), "object");
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
    },
      limitOffset);

    assert.strictEqual(typeof (records), "object");
  });

  it("filters by recordTypeKey", async () => {
    const records = await getRecords({
      recordTypeKey: "bylaw",
      searchString: ""
    },
      limitOffset);

    assert.strictEqual(typeof (records), "object");
  });

  it("filters by searchString", async () => {
    const records = await getRecords({
      recordTypeKey: "",
      searchString: "yard maintenance"
    },
      limitOffset);

    assert.strictEqual(typeof (records), "object");
  });

  it("filters by recordNumber", async () => {
    const records = await getRecords({
      recordTypeKey: "",
      searchString: "",
      recordNumber: "00-001"
    },
      limitOffset);

    assert.strictEqual(typeof (records), "object");
  });

  it("filters by recordDateStringGTE", async () => {
    const records = await getRecords({
      recordTypeKey: "",
      searchString: "",
      recordDateStringGTE: "2010-01-01"
    },
      limitOffset);

    assert.strictEqual(typeof (records), "object");
  });

  it("filters by recordDateStringLTE", async () => {
    const records = await getRecords({
      recordTypeKey: "",
      searchString: "",
      recordDateStringLTE: "2010-01-01"
    },
      limitOffset);

    assert.strictEqual(typeof (records), "object");
  });
});
