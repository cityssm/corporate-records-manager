/* eslint-disable unicorn/prefer-module */

import type * as recordTypes from "../types/recordTypes";

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
import type { CRM } from "../types/clientTypes";

declare const cityssm: cityssmGlobal;


(() => {
  const urlPrefix: string = exports.urlPrefix;
  const crm: CRM = exports.crm;

  const limit = Number.parseInt((document.querySelector("#search--limit") as HTMLInputElement).value, 10);
  const offsetElement = document.querySelector("#search--offset") as HTMLInputElement;

  const searchFormElement = document.querySelector("#form--search") as HTMLFormElement;
  const searchResultsContainerElement = document.querySelector("#container--search") as HTMLElement;

  const searchRecordsFunction = (formEvent?: Event) => {

    if (formEvent) {
      formEvent.preventDefault();
    }

    cityssm.clearElement(searchResultsContainerElement);

    searchResultsContainerElement.innerHTML = "<div class=\"has-text-grey has-text-centered\">" +
      "<i class=\"fas fa-4x fa-pulse fa-spinner\" aria-hidden=\"true\"></i><br />" +
      "Searching Records..." +
      "</div>";

    const offset = Number.parseInt(offsetElement.value, 10);

    cityssm.postJSON(urlPrefix + "/dashboard/doGetRecords", searchFormElement,
      (responseJSON: { count: number; records: recordTypes.Record[] }) => {

        if (responseJSON.records.length === 0) {
          searchResultsContainerElement.innerHTML = "<div class=\"message is-info\">" +
            "<div class=\"message-body\">There are no records that match the search criteria.</div>" +
            "</div>";

          return;
        }

        const pagerElement = document.createElement("div");
        pagerElement.className = "box p-3 is-flex is-justify-content-space-between is-align-items-center";
        pagerElement.innerHTML = "<div class=\"span has-text-weight-bold\">" +
          (offset + 1).toString() + " to " + Math.min(offset + limit, responseJSON.count).toString() + " of " + responseJSON.count.toString() +
          "</div>" +
          "<div class=\"span has-text-right\"></div>";

        if (offset !== 0) {

          const previousButtonElement = document.createElement("button");

          previousButtonElement.className = "button is-light is-info has-tooltip-left has-tooltip-arrow is-previous-button";
          previousButtonElement.dataset.tooltip = "Previous Results";
          previousButtonElement.type = "button";
          previousButtonElement.setAttribute("aria-label", "Previous Results");
          previousButtonElement.innerHTML = "<i class=\"fas fa-arrow-left\" aria-hidden=\"true\"></i>";

          pagerElement.querySelectorAll(".span")[1].append(previousButtonElement);
        }

        if (limit + offset < responseJSON.count) {

          const nextButtonElement = document.createElement("button");

          nextButtonElement.className = "button is-outlined is-info ml-1 is-next-button";
          nextButtonElement.type = "button";
          nextButtonElement.setAttribute("aria-label", "Next Results");
          nextButtonElement.innerHTML = "<span>Next</span>" +
            "<span class=\"icon\"><i class=\"fas fa-arrow-right\" aria-hidden=\"true\"></i></span>";

          pagerElement.querySelectorAll(".span")[1].append(nextButtonElement);
        }

        const panelElement = document.createElement("div");
        panelElement.className = "panel";

        for (const record of responseJSON.records) {

          const panelBlockElement = crm.renderRecordPanelLinkEle(record, {
            panelTag: "a"
          });
          panelElement.append(panelBlockElement);
        }

        searchResultsContainerElement.innerHTML = "";
        searchResultsContainerElement.append(pagerElement);
        searchResultsContainerElement.append(panelElement);
        searchResultsContainerElement.append(pagerElement.cloneNode(true));

        const nextButtonElements = searchResultsContainerElement.querySelectorAll(".is-next-button");

        for (const nextButtonElement of nextButtonElements) {
          nextButtonElement.addEventListener("click", nextFunction);
        }

        const previousButtonElements = searchResultsContainerElement.querySelectorAll(".is-previous-button");

        for (const previousButtonElement of previousButtonElements) {
          previousButtonElement.addEventListener("click", previousFunction);
        }
      });
  };

  const previousFunction = (clickEvent?: Event) => {

    if (clickEvent) {
      clickEvent.preventDefault();
    }

    offsetElement.value = Math.max(Number.parseInt(offsetElement.value, 10) - limit, 0).toString();

    searchRecordsFunction();
  };

  const nextFunction = (clickEvent?: Event) => {

    if (clickEvent) {
      clickEvent.preventDefault();
    }

    offsetElement.value = (Number.parseInt(offsetElement.value, 10) + limit).toString();

    searchRecordsFunction();
  };

  const resetOffsetAndSearchFunction = (formEvent?: Event) => {
    if (formEvent) {
      formEvent.preventDefault();
    }

    offsetElement.value = "0";

    searchRecordsFunction();
  };

  /*
   * Status Type Key
   */

  const recordTypeKeyElement = document.querySelector("#search--recordTypeKey") as HTMLSelectElement;
  const statusTypeKeyElement = document.querySelector("#search--statusTypeKey") as HTMLSelectElement;

  const statusTypeKeyMap = new Map<string, recordTypes.StatusType[]>();

  const renderStatusTypeKey = () => {

    statusTypeKeyElement.innerHTML = "<option value=\"\" selected>(All Statuses)</option>";

    if (!statusTypeKeyMap.has(recordTypeKeyElement.value)) {
      return;
    }

    for (const statusType of statusTypeKeyMap.get(recordTypeKeyElement.value)) {

      if (!statusType.isActive || statusType.recordCount === 0) {
        continue;
      }

      const optionElement = document.createElement("option");
      optionElement.value = statusType.statusTypeKey;
      optionElement.textContent = statusType.statusType;
      statusTypeKeyElement.append(optionElement);
    }
  };

  recordTypeKeyElement.addEventListener("change", () => {

    statusTypeKeyElement.innerHTML = "<option value=\"\" selected>(All Statuses)</option>";

    if (recordTypeKeyElement.value === "") {
      // ignore

    } else if (statusTypeKeyMap.has(recordTypeKeyElement.value)) {
      renderStatusTypeKey();

    } else {

      const recordTypeKey = recordTypeKeyElement.value;

      cityssm.postJSON(urlPrefix + "/dashboard/doGetStatusTypes", {
        recordTypeKey
      }, (responseJSON: { statusTypes: recordTypes.StatusType[] }) => {
        statusTypeKeyMap.set(recordTypeKey, responseJSON.statusTypes);
        renderStatusTypeKey();
      })
    }
  });

  /*
   * Initialize form
   */

  searchFormElement.addEventListener("submit", resetOffsetAndSearchFunction);

  const filterElements = searchFormElement.querySelectorAll("input, select");

  for (const filterElement of filterElements) {
    filterElement.addEventListener("change", resetOffsetAndSearchFunction);
  }

  searchRecordsFunction();

  document.querySelector("#button--searchMoreFiltersToggle").addEventListener("click", () => {

    const moreFiltersElement = document.querySelector("#fieldset--searchMoreFilters") as HTMLFieldSetElement;

    moreFiltersElement.classList.toggle("is-hidden");

    moreFiltersElement.disabled = moreFiltersElement.classList.contains("is-hidden") ? true : false;

    resetOffsetAndSearchFunction();
  });
})();

(() => {

  const urlPrefix: string = exports.urlPrefix;

  const datalistElement = document.querySelector("#search--recordTag-datalist") as HTMLDataListElement;

  document.querySelector("#search--recordTag").addEventListener("focus", () => {

    if (datalistElement.options.length === 0) {

      cityssm.postJSON(urlPrefix + "/dashboard/doGetRecordTagsForSearch", {}, (responseJSON: { tags: string[] }) => {
        datalistElement.textContent = "";

        for (const tag of responseJSON.tags) {
          const optionElement = document.createElement("option");
          optionElement.value = tag;
          datalistElement.append(optionElement);
        }
      });
    }
  });
})();

(() => {
  const maxDateValue = cityssm.dateToString(new Date());

  const gteElement = document.querySelector("#search--recordDateString-gte") as HTMLInputElement;
  const lteElement = document.querySelector("#search--recordDateString-lte") as HTMLInputElement;

  gteElement.addEventListener("change", () => {
    lteElement.min = gteElement.value;
  });

  lteElement.addEventListener("change", () => {
    let lteValue = lteElement.value;
    if (lteValue === "") {
      lteValue = maxDateValue;
    }

    gteElement.max = lteValue;
  });
})();
