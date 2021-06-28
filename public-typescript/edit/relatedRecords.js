"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(function () {
    var crm = exports.crm;
    var urlPrefix = exports.urlPrefix;
    var crmEdit = exports.crmEdit;
    var relatedRecords = exports.relatedRecords;
    delete exports.relatedRecords;
    var relatedRecordPanelEle = document.getElementById("panel--relatedRecords");
    var openRemoveRelatedRecordModalFn = function (clickEvent) {
        clickEvent.preventDefault();
        var panelBlockEle = clickEvent.currentTarget.closest(".panel-block");
        var index = parseInt(panelBlockEle.getAttribute("data-index"), 10);
        var relatedRecordID = parseInt(panelBlockEle.getAttribute("data-record-id"), 10);
        var removeFn = function () {
            cityssm.postJSON(urlPrefix + "/edit/doRemoveRelatedRecord", {
                recordID: crmEdit.recordID,
                relatedRecordID: relatedRecordID
            }, function (responseJSON) {
                if (responseJSON.success) {
                    relatedRecords.splice(index, 1);
                    crmEdit.clearPanelBlocksFn(relatedRecordPanelEle);
                    renderRelatedRecordsFn();
                }
                else {
                    cityssm.alertModal("Remove Related Record Error", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                }
            });
        };
        cityssm.confirmModal("Remove Comment", "Are you sure you want to remove this related record?", "Yes, Remove the Related Record", "warning", removeFn);
    };
    var renderRelatedRecordFn = function (relatedRecord, index) {
        var panelBlockEle = crm.renderRecordPanelLinkEle(relatedRecord, {
            panelTag: "div",
            includeRemoveButton: true
        });
        panelBlockEle.setAttribute("data-index", index.toString());
        panelBlockEle.setAttribute("data-record-id", relatedRecord.recordID.toString());
        panelBlockEle.getElementsByTagName("button")[0].addEventListener("click", openRemoveRelatedRecordModalFn);
        relatedRecordPanelEle.appendChild(panelBlockEle);
    };
    var renderRelatedRecordsFn = function () {
        crmEdit.clearPanelBlocksFn(relatedRecordPanelEle);
        if (relatedRecords.length === 0) {
            relatedRecordPanelEle.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
                "<div class=\"message is-info\">" +
                "<div class=\"message-body\">This record has no related records.</div>" +
                "</div>" +
                "</div>");
            return;
        }
        relatedRecords.forEach(renderRelatedRecordFn);
    };
    var getRelatedRecords = function () {
        crmEdit.clearPanelBlocksFn(relatedRecordPanelEle);
        relatedRecords = [];
        relatedRecordPanelEle.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block has-text-centered has-text-grey\">" +
            "<i class=\"fas fa-4x fa-spinner fa-pulse\" aria-hidden=\"true\"></i><br />" +
            "Loading Related Records..." +
            "</div>");
        cityssm.postJSON(urlPrefix + "/view/doGetRelatedRecords", {
            recordID: crmEdit.recordID
        }, function (responseJSON) {
            if (responseJSON.success) {
                relatedRecords = responseJSON.relatedRecords;
                renderRelatedRecordsFn();
            }
            else {
                relatedRecordPanelEle.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
                    "<div class=\"message is-danger\"><div class=\"message-body\">" +
                    responseJSON.message +
                    "</div></div>" +
                    "</div>");
            }
        });
    };
    renderRelatedRecordsFn();
    document.getElementById("is-add-related-button").addEventListener("click", function () {
        var doRefreshOnClose = false;
        var searchFormEle;
        var searchResultsContainerEle;
        var addFn = function (event) {
            event.preventDefault();
            var buttonEle = event.currentTarget;
            buttonEle.disabled = true;
            var panelBlockEle = buttonEle.closest(".panel-block");
            var relatedRecordID = panelBlockEle.getAttribute("data-record-id");
            cityssm.postJSON(urlPrefix + "/edit/doAddRelatedRecord", {
                recordID: crmEdit.recordID,
                relatedRecordID: relatedRecordID
            }, function (responseJSON) {
                if (responseJSON.success) {
                    doRefreshOnClose = true;
                    panelBlockEle.remove();
                }
                else {
                    cityssm.alertModal("Error Adding Related Record", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                    buttonEle.disabled = false;
                }
            });
        };
        var searchRecordsFn = function (event) {
            if (event) {
                event.preventDefault();
            }
            searchResultsContainerEle.innerHTML = "<div class=\"has-text-centered has-text-grey\">" +
                "<i class=\"fas fa-4x fa-spinner fa-pulse\" aria-hidden=\"true\"></i><br />" +
                "Searching Records..." +
                "</div>";
            cityssm.postJSON(urlPrefix + "/edit/doSearchRelatedRecords", searchFormEle, function (responseJSON) {
                if (!responseJSON.success) {
                    searchResultsContainerEle.innerHTML = "<div class=\"message is-danger\">" +
                        "<div class=\"message-body\">" +
                        "<p>" + cityssm.escapeHTML(responseJSON.message) + "</p>" +
                        "</div>" +
                        "</div>";
                    return;
                }
                var panelEle = document.createElement("div");
                panelEle.className = "panel";
                for (var _i = 0, _a = responseJSON.records; _i < _a.length; _i++) {
                    var relatedRecord = _a[_i];
                    var panelBlockEle = crm.renderRecordPanelLinkEle(relatedRecord, {
                        panelTag: "div",
                        includeAddButton: true
                    });
                    panelBlockEle.setAttribute("data-record-id", relatedRecord.recordID.toString());
                    panelBlockEle.getElementsByTagName("button")[0].addEventListener("click", addFn);
                    panelEle.appendChild(panelBlockEle);
                }
                searchResultsContainerEle.innerHTML = "";
                if (panelEle.children.length === 0) {
                    searchResultsContainerEle.innerHTML = "<div class=\"message is-info\">" +
                        "<div class=\"message-body\">" +
                        "<p>There are no new records that meet your search criteria.</p>" +
                        "</div>" +
                        "</div>";
                }
                else {
                    searchResultsContainerEle.appendChild(panelEle);
                }
            });
        };
        cityssm.openHtmlModal("relatedRecord-add", {
            onshow: function () {
                searchResultsContainerEle = document.getElementById("container--addRelatedRecord");
                searchFormEle = document.getElementById("form--addRelatedRecord-search");
                searchFormEle.addEventListener("submit", searchRecordsFn);
                document.getElementById("addRelatedRecord--recordID").value = crmEdit.recordID;
                var recordTypeKeyEle = document.getElementById("addRelatedRecord--recordTypeKey");
                for (var index = 0; index < exports.recordTypes.length; index += 1) {
                    var optionEle = document.createElement("option");
                    optionEle.value = exports.recordTypes[index].recordTypeKey;
                    optionEle.innerText = exports.recordTypes[index].recordType;
                    recordTypeKeyEle.appendChild(optionEle);
                    if (index === 0) {
                        recordTypeKeyEle.value = index.toString();
                    }
                }
                recordTypeKeyEle.addEventListener("change", searchRecordsFn);
                var searchStringEle = document.getElementById("addRelatedRecord--searchString");
                searchStringEle.value = document.getElementById("record--recordNumber").value;
                searchRecordsFn();
            },
            onhidden: function () {
                if (doRefreshOnClose) {
                    getRelatedRecords();
                }
            }
        });
    });
})();
