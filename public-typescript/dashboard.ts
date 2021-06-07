import type * as recordTypes from "../types/recordTypes";

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
declare const cityssm: cityssmGlobal;


(() => {
  const urlPrefix: string = exports.urlPrefix;

  const searchFormEle = document.getElementById("form--search") as HTMLFormElement;
  const searchResultsContainerEle = document.getElementById("container--search");

  const searchRecordsFn = (formEvent?: Event) => {

    if (formEvent) {
      formEvent.preventDefault();
    }

    cityssm.clearElement(searchResultsContainerEle);

    searchResultsContainerEle.innerHTML = "<div class=\"has-text-grey has-text-centered\">" +
      "<i class=\"fas fa-4x fa-pulse fa-spinner\" aria-hidden=\"true\"></i><br />" +
      "Searching Records..." +
      "</div>";

    cityssm.postJSON(urlPrefix + "/dashboard/doGetRecords", searchFormEle,
      (responseJSON: { records: recordTypes.Record[] }) => {

        if (responseJSON.records.length === 0) {
          searchResultsContainerEle.innerHTML = "<div class=\"message is-info\">" +
            "<div class=\"message-body\">There are no records that match the search criteria.</div>" +
            "</div>";

          return;
        }

        const panelEle = document.createElement("div");
        panelEle.className = "panel";

        for (const record of responseJSON.records) {

          const panelBlockEle = document.createElement("a");
          panelBlockEle.className = "panel-block is-block";
          panelBlockEle.href = urlPrefix + "/view/" + record.recordID.toString();

          panelBlockEle.innerHTML = "<strong>" + record.recordTitle + "</strong><br />" +
            record.recordNumber;

          panelEle.appendChild(panelBlockEle);
        }

        searchResultsContainerEle.innerHTML = "";
        searchResultsContainerEle.appendChild(panelEle);
      });
  };

  searchFormEle.addEventListener("submit", searchRecordsFn);

  document.getElementById("search--recordTypeKey").addEventListener("change", searchRecordsFn);
  document.getElementById("search--searchString").addEventListener("change", searchRecordsFn);

  searchRecordsFn();
})();
