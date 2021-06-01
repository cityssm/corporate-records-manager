import type * as recordTypes from "../types/recordTypes";

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
declare const cityssm: cityssmGlobal;


(() => {
  const urlPrefix: string = exports.urlPrefix;
  const recordID = (document.getElementById("record--recordID") as HTMLInputElement).value;

  /*
   * Statuses
   */

  {
    const statusPanelEle = document.getElementById("panel--statuses");

    const renderStatusesFn = (statuses: recordTypes.RecordStatus[]) => {

    };

    renderStatusesFn(exports.recordStatuses);
    delete exports.recordStatuses;
  }

  /*
   * URLs
   */

  {
    const urlPanelEle = document.getElementById("panel--urls");

    const renderURLsFn = (urls: recordTypes.RecordURL[]) => {

    };

    renderURLsFn(exports.recordURLs);
    delete exports.recordURLs;
  }

  /*
   * Related Records
   */

  {
    const relatedRecordPanelEle = document.getElementById("panel--relatedRecords");
  }

  /*
   * Comments
   */

  {
    const commentPanelEle = document.getElementById("panel--comments");

    const renderCommentsFn = (urls: recordTypes.RecordComment[]) => {

    };

    renderCommentsFn(exports.recordComments);
    delete exports.recordComments;
  }
})();
