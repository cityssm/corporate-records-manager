"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const crm = exports.crm;
    const urlPrefix = exports.urlPrefix;
    const crmEdit = exports.crmEdit;
    let relatedRecords = exports.relatedRecords;
    delete exports.relatedRecords;
    const relatedRecordPanelEle = document.querySelector("#panel--relatedRecords");
    const openRemoveRelatedRecordModalFunction = (clickEvent) => {
        clickEvent.preventDefault();
        const panelBlockEle = clickEvent.currentTarget.closest(".panel-block");
        const index = Number.parseInt(panelBlockEle.getAttribute("data-index"), 10);
        const relatedRecordID = Number.parseInt(panelBlockEle.getAttribute("data-record-id"), 10);
        const removeFunction = () => {
            cityssm.postJSON(urlPrefix + "/edit/doRemoveRelatedRecord", {
                recordID: crmEdit.recordID,
                relatedRecordID
            }, (responseJSON) => {
                if (responseJSON.success) {
                    relatedRecords.splice(index, 1);
                    crmEdit.clearPanelBlocksFunction(relatedRecordPanelEle);
                    renderRelatedRecordsFunction();
                }
                else {
                    cityssm.alertModal("Remove Related Record Error", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                }
            });
        };
        cityssm.confirmModal("Remove Comment", "Are you sure you want to remove this related record?", "Yes, Remove the Related Record", "warning", removeFunction);
    };
    const renderRelatedRecordFunction = (relatedRecord, index) => {
        const panelBlockEle = crm.renderRecordPanelLinkEle(relatedRecord, {
            panelTag: "div",
            includeRemoveButton: true
        });
        panelBlockEle.dataset.index = index.toString();
        panelBlockEle.dataset.recordId = relatedRecord.recordID.toString();
        panelBlockEle.querySelectorAll("button")[0].addEventListener("click", openRemoveRelatedRecordModalFunction);
        relatedRecordPanelEle.append(panelBlockEle);
    };
    const renderRelatedRecordsFunction = () => {
        crmEdit.clearPanelBlocksFunction(relatedRecordPanelEle);
        if (relatedRecords.length === 0) {
            relatedRecordPanelEle.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
                "<div class=\"message is-info\">" +
                "<div class=\"message-body\">This record has no related records.</div>" +
                "</div>" +
                "</div>");
            return;
        }
        for (const [index, relatedRecord] of relatedRecords.entries()) {
            renderRelatedRecordFunction(relatedRecord, index);
        }
    };
    const getRelatedRecords = () => {
        crmEdit.clearPanelBlocksFunction(relatedRecordPanelEle);
        relatedRecords = [];
        relatedRecordPanelEle.insertAdjacentHTML("beforeend", crmEdit.getLoadingPanelBlockHTML("Related Records"));
        cityssm.postJSON(urlPrefix + "/view/doGetRelatedRecords", {
            recordID: crmEdit.recordID
        }, (responseJSON) => {
            if (responseJSON.success) {
                relatedRecords = responseJSON.relatedRecords;
                renderRelatedRecordsFunction();
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
    renderRelatedRecordsFunction();
    document.querySelector("#is-add-related-button").addEventListener("click", () => {
        let doRefreshOnClose = false;
        let searchFormEle;
        let searchResultsContainerEle;
        const addFunction = (event) => {
            event.preventDefault();
            const buttonEle = event.currentTarget;
            buttonEle.disabled = true;
            const panelBlockEle = buttonEle.closest(".panel-block");
            const relatedRecordID = panelBlockEle.getAttribute("data-record-id");
            cityssm.postJSON(urlPrefix + "/edit/doAddRelatedRecord", {
                recordID: crmEdit.recordID,
                relatedRecordID: relatedRecordID
            }, (responseJSON) => {
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
        const searchRecordsFunction = (event) => {
            if (event) {
                event.preventDefault();
            }
            searchResultsContainerEle.innerHTML = "<div class=\"has-text-centered has-text-grey\">" +
                "<i class=\"fas fa-4x fa-spinner fa-pulse\" aria-hidden=\"true\"></i><br />" +
                "Searching Records..." +
                "</div>";
            cityssm.postJSON(urlPrefix + "/edit/doSearchRelatedRecords", searchFormEle, (responseJSON) => {
                if (!responseJSON.success) {
                    searchResultsContainerEle.innerHTML = "<div class=\"message is-danger\">" +
                        "<div class=\"message-body\">" +
                        "<p>" + cityssm.escapeHTML(responseJSON.message) + "</p>" +
                        "</div>" +
                        "</div>";
                    return;
                }
                const panelEle = document.createElement("div");
                panelEle.className = "panel";
                for (const relatedRecord of responseJSON.records) {
                    const panelBlockEle = crm.renderRecordPanelLinkEle(relatedRecord, {
                        panelTag: "div",
                        includeAddButton: true
                    });
                    panelBlockEle.dataset.recordId = relatedRecord.recordID.toString();
                    panelBlockEle.querySelectorAll("button")[0].addEventListener("click", addFunction);
                    panelEle.append(panelBlockEle);
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
                    searchResultsContainerEle.append(panelEle);
                }
            });
        };
        cityssm.openHtmlModal("relatedRecord-add", {
            onshow: () => {
                searchResultsContainerEle = document.querySelector("#container--addRelatedRecord");
                searchFormEle = document.querySelector("#form--addRelatedRecord-search");
                searchFormEle.addEventListener("submit", searchRecordsFunction);
                document.querySelector("#addRelatedRecord--recordID").value = crmEdit.recordID;
                const recordTypeKeyEle = document.querySelector("#addRelatedRecord--recordTypeKey");
                for (let index = 0; index < exports.recordTypes.length; index += 1) {
                    const optionEle = document.createElement("option");
                    optionEle.value = exports.recordTypes[index].recordTypeKey;
                    optionEle.textContent = exports.recordTypes[index].recordType;
                    recordTypeKeyEle.append(optionEle);
                    if (index === 0) {
                        recordTypeKeyEle.value = index.toString();
                    }
                }
                recordTypeKeyEle.addEventListener("change", searchRecordsFunction);
                const searchStringEle = document.querySelector("#addRelatedRecord--searchString");
                searchStringEle.value = document.querySelector("#record--recordNumber").value;
                searchRecordsFunction();
            },
            onhidden: () => {
                if (doRefreshOnClose) {
                    getRelatedRecords();
                }
            }
        });
    });
})();
