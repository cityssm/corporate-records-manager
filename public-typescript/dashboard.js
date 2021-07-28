"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const urlPrefix = exports.urlPrefix;
    const crm = exports.crm;
    const limit = Number.parseInt(document.querySelector("#search--limit").value, 10);
    const offsetEle = document.querySelector("#search--offset");
    const searchFormEle = document.querySelector("#form--search");
    const searchResultsContainerEle = document.querySelector("#container--search");
    const searchRecordsFunction = (formEvent) => {
        if (formEvent) {
            formEvent.preventDefault();
        }
        cityssm.clearElement(searchResultsContainerEle);
        searchResultsContainerEle.innerHTML = "<div class=\"has-text-grey has-text-centered\">" +
            "<i class=\"fas fa-4x fa-pulse fa-spinner\" aria-hidden=\"true\"></i><br />" +
            "Searching Records..." +
            "</div>";
        const offset = Number.parseInt(offsetEle.value, 10);
        cityssm.postJSON(urlPrefix + "/dashboard/doGetRecords", searchFormEle, (responseJSON) => {
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
                const previousButtonEle = document.createElement("button");
                previousButtonEle.className = "button is-light is-info has-tooltip-left has-tooltip-arrow is-previous-button";
                previousButtonEle.dataset.tooltip = "Previous Results";
                previousButtonEle.type = "button";
                previousButtonEle.setAttribute("aria-label", "Previous Results");
                previousButtonEle.innerHTML = "<i class=\"fas fa-arrow-left\" aria-hidden=\"true\"></i>";
                pagerEle.querySelectorAll(".span")[1].append(previousButtonEle);
            }
            if (limit + offset < responseJSON.count) {
                const nextButtonEle = document.createElement("button");
                nextButtonEle.className = "button is-outlined is-info ml-1 is-next-button";
                nextButtonEle.type = "button";
                nextButtonEle.setAttribute("aria-label", "Next Results");
                nextButtonEle.innerHTML = "<span>Next</span>" +
                    "<span class=\"icon\"><i class=\"fas fa-arrow-right\" aria-hidden=\"true\"></i></span>";
                pagerEle.querySelectorAll(".span")[1].append(nextButtonEle);
            }
            const panelEle = document.createElement("div");
            panelEle.className = "panel";
            for (const record of responseJSON.records) {
                const panelBlockEle = crm.renderRecordPanelLinkEle(record, {
                    panelTag: "a"
                });
                panelEle.append(panelBlockEle);
            }
            searchResultsContainerEle.innerHTML = "";
            searchResultsContainerEle.append(pagerEle);
            searchResultsContainerEle.append(panelEle);
            searchResultsContainerEle.append(pagerEle.cloneNode(true));
            const nextButtonElements = searchResultsContainerEle.querySelectorAll(".is-next-button");
            for (const nextButtonElement of nextButtonElements) {
                nextButtonElement.addEventListener("click", nextFunction);
            }
            const previousButtonElements = searchResultsContainerEle.querySelectorAll(".is-previous-button");
            for (const previousButtonElement of previousButtonElements) {
                previousButtonElement.addEventListener("click", previousFunction);
            }
        });
    };
    const previousFunction = (clickEvent) => {
        if (clickEvent) {
            clickEvent.preventDefault();
        }
        offsetEle.value = Math.max(Number.parseInt(offsetEle.value, 10) - limit, 0).toString();
        searchRecordsFunction();
    };
    const nextFunction = (clickEvent) => {
        if (clickEvent) {
            clickEvent.preventDefault();
        }
        offsetEle.value = (Number.parseInt(offsetEle.value, 10) + limit).toString();
        searchRecordsFunction();
    };
    const resetOffsetAndSearchFunction = (formEvent) => {
        if (formEvent) {
            formEvent.preventDefault();
        }
        offsetEle.value = "0";
        searchRecordsFunction();
    };
    searchFormEle.addEventListener("submit", resetOffsetAndSearchFunction);
    const filterEles = searchFormEle.querySelectorAll("input, select");
    for (const filterEle of filterEles) {
        filterEle.addEventListener("change", resetOffsetAndSearchFunction);
    }
    searchRecordsFunction();
    document.querySelector("#button--searchMoreFiltersToggle").addEventListener("click", () => {
        const moreFiltersEle = document.querySelector("#fieldset--searchMoreFilters");
        moreFiltersEle.classList.toggle("is-hidden");
        moreFiltersEle.disabled = moreFiltersEle.classList.contains("is-hidden") ? true : false;
        resetOffsetAndSearchFunction();
    });
})();
(() => {
    const maxDateValue = cityssm.dateToString(new Date());
    const gteEle = document.querySelector("#search--recordDateString-gte");
    const lteEle = document.querySelector("#search--recordDateString-lte");
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
