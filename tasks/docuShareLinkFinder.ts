import { setIntervalAsync, clearIntervalAsync } from "set-interval-async/fixed/index.js";

import * as configFns from "../helpers/configFns.js";
import * as docuShareFns from "../helpers/docuShareFns.js";

import { getRecordNumbersByRecordTypeKey } from "../helpers/recordsDB/getRecordNumbersByRecordTypeKey.js";
import { getActiveDocuShareURLs } from "../helpers/recordsDB/getActiveDocuShareURLs.js";
import { addURL } from "../helpers/recordsDB/addURL.js";

import * as ds from "@cityssm/docushare";

import type * as recordTypes from "../types/recordTypes";

import debug from "debug";
const debugTask = debug("corporate-records-manager:task:docuShareLinkFinder");


docuShareFns.doSetup();


const getActiveDocuShareURLCache = async () => {

  const set = new Set<string>();

  const activeURLs = await getActiveDocuShareURLs();

  for (const activeURL of activeURLs) {
    set.add(activeURL.url);
  }

  return set;
};


const doTask = async () => {

  debugTask("Starting DocuShare Link Finder Task");

  const recordCache = new Map<string, recordTypes.Record[]>();

  debugTask("Get DocuShare collection handle configs");
  const collectionHandles = configFns.getProperty("integrations.docuShare.collectionHandles");

  if (collectionHandles.length === 0) {
    debugTask("No DocuShare collection handles avaialble.");
    return;
  }

  debugTask("Get active DocuShare URLs");
  const activeURLs = await getActiveDocuShareURLCache();

  for (const collectionHandle of collectionHandles) {

    // if the handle is not specific to a recordTypeKey
    if (!collectionHandle.recordTypeKeys) {
      continue;
    }

    // get all of the children in the collection
    debugTask("Get children in DocuShare handle " + collectionHandle.handle);
    const dsOutput = await ds.getChildren(collectionHandle.handle);

    if (!dsOutput.success) {
      debugTask("Error loading handle " + collectionHandle.handle);
      debugTask(dsOutput.error);
      continue;
    }

    // loop through the recordTypeKeys
    for (const recordTypeKey of collectionHandle.recordTypeKeys) {

      // load cache if necessary
      if (!recordCache.has(recordTypeKey)) {
        debugTask("Get recordNumbers from recordTypeKey " + recordTypeKey);
        const recordNumbers = await getRecordNumbersByRecordTypeKey(recordTypeKey);
        recordCache.set(recordTypeKey, recordNumbers);
      }

      const recordNumbers = recordCache.get(recordTypeKey);

      // loop through docushare children
      for (const dsObject of dsOutput.dsObjects) {

        const url = docuShareFns.getURL(dsObject.handle);

        // skip urls that already are linked
        if (activeURLs.has(url)) {
          continue;
        }

        for (const recordNumber of recordNumbers) {

          if (dsObject.title.includes(recordNumber.recordNumber)) {

            debugTask("Creating link: " + JSON.stringify({
              recordID: recordNumber.recordID,
              recordNumber: recordNumber.recordNumber,
              handle: dsObject.handle,
              title: dsObject.title
            }));

            await addURL({
              recordID: recordNumber.recordID,
              url: url,
              urlTitle: dsObject.title,
              urlDescription: dsObject.summary || ""
            }, {
                user: {
                  userName: "task.docushare",
                  canUpdate: true,
                  isAdmin: true
                }
              });

            break;
          }
        }
      }
    }
  }
};


doTask().catch(() => {
  // ignore
});


const timer = setIntervalAsync(doTask, 2 * 3600 * 1000);


if (process) {

  const stopTimer = () => {
    clearIntervalAsync(timer)
      .then(() => {
        debugTask("Task stopped");
      })
      .catch(() => {
        // ignore
      });
  };

  for (const shutdownEvent of ["beforeExit", "exit", "SIGINT", "SIGTERM"]) {
    process.on(shutdownEvent, stopTimer);
  }
}
