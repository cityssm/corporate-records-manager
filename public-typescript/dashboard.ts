import type * as recordTypes from "../types/recordTypes";

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
import type { CRM } from "../types/clientTypes";

declare const cityssm: cityssmGlobal;


(() => {
  const urlPrefix: string = exports.urlPrefix;
  const crm: CRM = exports.crm;

  const limit = parseInt((document.getElementById("search--limit") as HTMLInputElement).value, 10);
  const offsetEle = document.getElementById("search--offset") as HTMLInputElement;

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

    const offset = parseInt(offsetEle.value, 10);

    cityssm.postJSON(urlPrefix + "/dashboard/doGetRecords", searchFormEle,
      (responseJSON: { count: number; records: recordTypes.Record[] }) => {

        if (responseJSON.records.length === 0) {
          searchResultsContainerEle.innerHTML = "<div class=\"message is-info\">" +
            "<div class=\"message-body\">There are no records that match the search criteria.</div>" +
            "</div>";

          return;
        }

        const pagerEle = document.createElement("div");
        pagerEle.className = "box p-3 is-flex is-justify-content-space-between is-align-items-center";
        pagerEle.innerHTML = "<div class=\"span has-text-weight-bold\">" +
          (offset + 1).toString() + " to " + Math.min(offset + limit, responseJSON.count).toString() + " of " + responseJSON.count.toString() +
          "</div>" +
          "<div class=\"span has-text-right\"></div>";

        if (offset !== 0) {

          const prevButtonEle = document.createElement("button");

          prevButtonEle.className = "button is-light is-info has-tooltip-left has-tooltip-arrow";
          prevButtonEle.setAttribute("data-tooltip", "Previous Results");
          prevButtonEle.type = "button";
          prevButtonEle.setAttribute("aria-label", "Previous Results");
          prevButtonEle.innerHTML = "<i class=\"fas fa-arrow-left\" aria-hidden=\"true\"></i>";

          prevButtonEle.addEventListener("click", previousFn);

          pagerEle.getElementsByClassName("span")[1].appendChild(prevButtonEle);
        }

        if (limit + offset < responseJSON.count) {

          const prevButtonEle = document.createElement("button");

          prevButtonEle.className = "button is-outlined is-info ml-1";
          prevButtonEle.type = "button";
          prevButtonEle.setAttribute("aria-label", "Next Results");
          prevButtonEle.innerHTML = "<span>Next</span>" +
            "<span class=\"icon\"><i class=\"fas fa-arrow-right\" aria-hidden=\"true\"></i></span>";

          prevButtonEle.addEventListener("click", nextFn);

          pagerEle.getElementsByClassName("span")[1].appendChild(prevButtonEle);
        }

        const panelEle = document.createElement("div");
        panelEle.className = "panel";

        for (const record of responseJSON.records) {

          const panelBlockEle = crm.renderRecordPanelLinkEle(record, {
            panelTag: "a"
          });
          panelEle.appendChild(panelBlockEle);
        }

        searchResultsContainerEle.innerHTML = "";
        searchResultsContainerEle.appendChild(pagerEle);
        searchResultsContainerEle.appendChild(panelEle);
      });
  };

  const previousFn = (clickEvent?: Event) => {

    if (clickEvent) {
      clickEvent.preventDefault();
    }

    offsetEle.value = Math.max(parseInt(offsetEle.value, 10) - limit, 0).toString();

    searchRecordsFn();
  };

  const nextFn = (clickEvent?: Event) => {

    if (clickEvent) {
      clickEvent.preventDefault();
    }

    offsetEle.value = (parseInt(offsetEle.value, 10) + limit).toString();

    searchRecordsFn();
  };

  const resetOffsetAndSearchFn = (formEvent?: Event) => {
    if (formEvent) {
      formEvent.preventDefault();
    }

    offsetEle.value = "0";

    searchRecordsFn();
  };

  searchFormEle.addEventListener("submit", resetOffsetAndSearchFn);

  const filterEles = searchFormEle.querySelectorAll("input, select");

  filterEles.forEach((filterEle) => {
    filterEle.addEventListener("change", resetOffsetAndSearchFn);
  });

  searchRecordsFn();

  document.getElementById("button--searchMoreFiltersToggle").addEventListener("click", () => {

    const moreFiltersEle = document.getElementById("fieldset--searchMoreFilters") as HTMLFieldSetElement;

    moreFiltersEle.classList.toggle("is-hidden");

    if (moreFiltersEle.classList.contains("is-hidden")) {
      moreFiltersEle.disabled = true;
    } else {
      moreFiltersEle.disabled = false;
    }

    resetOffsetAndSearchFn();
  });
})();

(() => {
  const maxDateValue = cityssm.dateToString(new Date());

  const gteEle = document.getElementById("search--recordDateString-gte") as HTMLInputElement;
  const lteEle = document.getElementById("search--recordDateString-lte") as HTMLInputElement;

  gteEle.addEventListener("change", () => {
    lteEle.min = gteEle.value;
  });

  lteEle.addEventListener("change", () => {
    let lteValue = lteEle.value;
    if (lteValue === "") {
      lteValue = maxDateValue;
    }

    gteEle.max = lteValue;
  });
})();
