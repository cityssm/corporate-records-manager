import * as assert from "assert";

import * as pool from "@cityssm/mssql-multi-pool";

import { getRecordTypes, getStatusTypes } from "../helpers/recordsDB/configCache.js";


describe("recordsDB - getRecord()", () => {

  after(async () => {
    await pool.releaseAll();
  });

  it("should execute getRecordTypes()", async () => {

    // call twice to ensure one is retrieved from the cache
    const recordTypesA = await getRecordTypes();
    const recordTypesB = await getRecordTypes();

    assert.strictEqual(recordTypesA.length, recordTypesB.length);
  });

  it("should execute getStatusTypes()", async () => {

    // call twice to ensure one is retrieved from the cache
    const statusTypesA = await getStatusTypes("bylaw");
    const statusTypesB = await getStatusTypes("bylaw");

    assert.strictEqual(statusTypesA.length, statusTypesB.length);
  });
});