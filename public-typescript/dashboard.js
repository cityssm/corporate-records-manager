"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(function () {
    var urlPrefix = exports.urlPrefix;
    var crm = exports.crm;
    var limit = parseInt(document.getElementById("search--limit").value, 10);
    var offsetEle = document.getElementById("search--offset");
    var searchFormEle = document.getElementById("form--search");
    var searchResultsContainerEle = document.getElementById("container--search");
    var searchRecordsFn = function (formEvent) {
        if (formEvent) {
            formEvent.preventDefault();
        }
        cityssm.clearElement(searchResultsContainerEle);
        searchResultsContainerEle.innerHTML = "<div class=\"has-text-grey has-text-centered\">" +
            "<i class=\"fas fa-4x fa-pulse fa-spinner\" aria-hidden=\"true\"></i><br />" +
            "Searching Records..." +
            "</div>";
        var offset = parseInt(offsetEle.value, 10);
        cityssm.postJSON(urlPrefix + "/dashboard/doGetRecords", searchFormEle, function (responseJSON) {
            if (responseJSON.records.length === 0) {
                searchResultsContainerEle.innerHTML = "<div class=\"message is-info\">" +
                    "<div class=\"message-body\">There are no records that match the search criteria.</div>" +
                    "</div>";
                return;
            }
            var pagerEle = document.createElement("div");
            pagerEle.className = "box p-3 is-flex is-justify-content-space-between is-align-items-center";
            pagerEle.innerHTML = "<div class=\"span has-text-weight-bold\">" +
                (offset + 1).toString() + " to " + Math.min(offset + limit, responseJSON.count).toString() + " of " + responseJSON.count.toString() +
                "</div>" +
                "<div class=\"span has-text-right\"></div>";
            if (offset !== 0) {
                var prevButtonEle = document.createElement("button");
                prevButtonEle.className = "button is-light is-info has-tooltip-left has-tooltip-arrow";
                prevButtonEle.setAttribute("data-tooltip", "Previous Results");
                prevButtonEle.type = "button";
                prevButtonEle.setAttribute("aria-label", "Previous Results");
                prevButtonEle.innerHTML = "<i class=\"fas fa-arrow-left\" aria-hidden=\"true\"></i>";
                prevButtonEle.addEventListener("click", previousFn);
                pagerEle.getElementsByClassName("span")[1].appendChild(prevButtonEle);
            }
            if (limit + offset < responseJSON.count) {
                var prevButtonEle = document.createElement("button");
                prevButtonEle.className = "button is-outlined is-info ml-1";
                prevButtonEle.type = "button";
                prevButtonEle.setAttribute("aria-label", "Next Results");
                prevButtonEle.innerHTML = "<span>Next</span>" +
                    "<span class=\"icon\"><i class=\"fas fa-arrow-right\" aria-hidden=\"true\"></i></span>";
                prevButtonEle.addEventListener("click", nextFn);
                pagerEle.getElementsByClassName("span")[1].appendChild(prevButtonEle);
            }
            var panelEle = document.createElement("div");
            panelEle.className = "panel";
            for (var _i = 0, _a = responseJSON.records; _i < _a.length; _i++) {
                var record = _a[_i];
                var panelBlockEle = crm.renderRecordPanelLinkEle(record, {
                    panelTag: "a"
                });
                panelEle.appendChild(panelBlockEle);
            }
            searchResultsContainerEle.innerHTML = "";
            searchResultsContainerEle.appendChild(pagerEle);
            searchResultsContainerEle.appendChild(panelEle);
        });
    };
    var previousFn = function (clickEvent) {
        if (clickEvent) {
            clickEvent.preventDefault();
        }
        offsetEle.value = Math.max(parseInt(offsetEle.value, 10) - limit, 0).toString();
        searchRecordsFn();
    };
    var nextFn = function (clickEvent) {
        if (clickEvent) {
            clickEvent.preventDefault();
        }
        offsetEle.value = (parseInt(offsetEle.value, 10) + limit).toString();
        searchRecordsFn();
    };
    var resetOffsetAndSearchFn = function (formEvent) {
        if (formEvent) {
            formEvent.preventDefault();
        }
        offsetEle.value = "0";
        searchRecordsFn();
    };
    searchFormEle.addEventListener("submit", resetOffsetAndSearchFn);
    var filterEles = searchFormEle.querySelectorAll("input, select");
    filterEles.forEach(function (filterEle) {
        filterEle.addEventListener("change", resetOffsetAndSearchFn);
    });
    searchRecordsFn();
    document.getElementById("button--searchMoreFiltersToggle").addEventListener("click", function () {
        var moreFiltersEle = document.getElementById("fieldset--searchMoreFilters");
        moreFiltersEle.classList.toggle("is-hidden");
        if (moreFiltersEle.classList.contains("is-hidden")) {
            moreFiltersEle.disabled = true;
        }
        else {
            moreFiltersEle.disabled = false;
        }
        resetOffsetAndSearchFn();
    });
})();
(function () {
    var maxDateValue = cityssm.dateToString(new Date());
    var gteEle = document.getElementById("search--recordDateString-gte");
    var lteEle = document.getElementById("search--recordDateString-lte");
    gteEle.addEventListener("change", function () {
        lteEle.min = gteEle.value;
    });
    lteEle.addEventListener("change", function () {
        var lteValue = lteEle.value;
        if (lteValue === "") {
            lteValue = maxDateValue;
        }
        gteEle.max = lteValue;
    });
})();
