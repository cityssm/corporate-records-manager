"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(function () {
    var urlPrefix = exports.urlPrefix;
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
        cityssm.postJSON(urlPrefix + "/dashboard/doGetRecords", searchFormEle, function (responseJSON) {
            if (responseJSON.records.length === 0) {
                searchResultsContainerEle.innerHTML = "<div class=\"message is-info\">" +
                    "<div class=\"message-body\">There are no records that match the search criteria.</div>" +
                    "</div>";
                return;
            }
            var panelEle = document.createElement("div");
            panelEle.className = "panel";
            for (var _i = 0, _a = responseJSON.records; _i < _a.length; _i++) {
                var record = _a[_i];
                var panelBlockEle = document.createElement("a");
                panelBlockEle.className = "panel-block is-block";
                panelBlockEle.href = urlPrefix + "/view/" + record.recordID.toString();
                panelBlockEle.innerHTML = "<strong>" + cityssm.escapeHTML(record.recordTitle) + "</strong><br />" +
                    cityssm.escapeHTML(record.recordNumber) + "<br />" +
                    "<span class=\"is-size-7\">" +
                    cityssm.escapeHTML(record.recordDescription.length > 500
                        ? record.recordDescription.substring(0, 497) + " ..."
                        : record.recordDescription) +
                    "</span>";
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
