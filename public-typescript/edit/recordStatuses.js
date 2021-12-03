"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const urlPrefix = exports.urlPrefix;
    const crmEdit = exports.crmEdit;
    const statusPanelElement = document.querySelector("#panel--statuses");
    if (!statusPanelElement) {
        return;
    }
    let statuses = exports.recordStatuses;
    delete exports.recordStatuses;
    const openEditStatusModalFunction = (clickEvent) => {
        clickEvent.preventDefault();
        const panelBlockElement = clickEvent.currentTarget.closest(".panel-block");
        const index = Number.parseInt(panelBlockElement.dataset.index, 10);
        const status = statuses[index];
        let closeEditModalFunction;
        const editFunction = (formEvent) => {
            formEvent.preventDefault();
            cityssm.postJSON(urlPrefix + "/edit/doUpdateStatus", formEvent.currentTarget, (responseJSON) => {
                if (responseJSON.success) {
                    getStatuses();
                    closeEditModalFunction();
                }
                else {
                    cityssm.alertModal("Update Status Error", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                }
            });
        };
        cityssm.openHtmlModal("status-edit", {
            onshow: () => {
                document.querySelector("#editStatus--statusLogID").value = status.statusLogID.toString();
                const statusTypeKeyElement = document.querySelector("#editStatus--statusTypeKey");
                const statusTypes = exports.statusTypes;
                let statusTypeKeyFound = false;
                for (const statusType of statusTypes) {
                    if (statusType.isActive || statusType.statusTypeKey === status.statusTypeKey) {
                        statusTypeKeyElement.insertAdjacentHTML("beforeend", "<option value=\"" + cityssm.escapeHTML(statusType.statusTypeKey) + "\">" +
                            cityssm.escapeHTML(statusType.statusType) +
                            "</option>");
                        if (statusType.statusTypeKey === status.statusTypeKey) {
                            statusTypeKeyFound = true;
                        }
                    }
                }
                if (!statusTypeKeyFound) {
                    statusTypeKeyElement.insertAdjacentHTML("beforeend", "<option value=\"" + cityssm.escapeHTML(status.statusTypeKey) + "\">" +
                        cityssm.escapeHTML(status.statusTypeKey) +
                        "</option>");
                }
                statusTypeKeyElement.value = status.statusTypeKey;
                const statusTime = new Date(status.statusTime);
                document.querySelector("#editStatus--statusDateString").value = cityssm.dateToString(statusTime);
                document.querySelector("#editStatus--statusTimeString").value = cityssm.dateToTimeString(statusTime);
                document.querySelector("#editStatus--statusLog").value = status.statusLog;
                document.querySelector("#form--editStatus").addEventListener("submit", editFunction);
            },
            onshown: (_modalElement, closeModalFunction) => {
                bulmaJS.toggleHtmlClipped();
                closeEditModalFunction = closeModalFunction;
            },
            onremoved: () => {
                bulmaJS.toggleHtmlClipped();
            }
        });
    };
    const openRemoveStatusModalFunction = (clickEvent) => {
        clickEvent.preventDefault();
        const panelBlockElement = clickEvent.currentTarget.closest(".panel-block");
        const index = Number.parseInt(panelBlockElement.dataset.index, 10);
        const status = statuses[index];
        const removeFunction = () => {
            cityssm.postJSON(urlPrefix + "/edit/doRemoveStatus", {
                statusLogID: status.statusLogID
            }, (responseJSON) => {
                if (responseJSON.success) {
                    statuses.splice(index, 1);
                    crmEdit.clearPanelBlocksFunction(statusPanelElement);
                    renderStatusesFunction();
                }
                else {
                    cityssm.alertModal("Remove Status Error", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                }
            });
        };
        cityssm.confirmModal("Remove Status", "Are you sure you want to remove this status?<br />" +
            "If the status of this record has changed, it would be better to add a new status.", "Yes, Remove the Status", "warning", removeFunction);
    };
    const renderStatusFunction = (status, index) => {
        const panelBlockElement = document.createElement("div");
        panelBlockElement.className = "panel-block is-block";
        panelBlockElement.dataset.statusLogId = status.statusLogID.toString();
        panelBlockElement.dataset.index = index.toString();
        const statusType = exports.statusTypes.find((possibleStatusType) => {
            return possibleStatusType.statusTypeKey === status.statusTypeKey;
        });
        const statusTime = new Date(status.statusTime);
        panelBlockElement.innerHTML = "<div class=\"columns\">" +
            ("<div class=\"column\">" +
                "<strong>" + cityssm.escapeHTML(statusType ? statusType.statusType : status.statusTypeKey) + "</strong><br />" +
                "<span class=\"has-tooltip-arrow has-tooltip-right\" data-tooltip=\"" + cityssm.dateToTimeString(statusTime) + "\">" + cityssm.dateToString(statusTime) + "</span><br />" +
                "<span class=\"is-size-7\">" + cityssm.escapeHTML(status.statusLog) + "</span>" +
                "</div>") +
            ("<div class=\"column is-narrow\">" +
                "<button class=\"button is-info is-light is-small\" type=\"button\">" +
                "<span class=\"icon\"><i class=\"fas fa-pencil-alt\" aria-hidden=\"true\"></i></span>" +
                "<span>Edit</span>" +
                "</button>" +
                " <button class=\"button is-danger is-light is-small has-tooltip-arrow has-tooltip-left\" data-tooltip=\"Remove Status\" aria-label=\"Remove Status\" type=\"button\">" +
                "<span class=\"icon\"><i class=\"fas fa-trash-alt\" aria-hidden=\"true\"></i></span>" +
                "</button>" +
                "</div>") +
            "</div>";
        const buttonElements = panelBlockElement.querySelectorAll("button");
        buttonElements[0].addEventListener("click", openEditStatusModalFunction);
        buttonElements[1].addEventListener("click", openRemoveStatusModalFunction);
        statusPanelElement.append(panelBlockElement);
    };
    const renderStatusesFunction = () => {
        crmEdit.clearPanelBlocksFunction(statusPanelElement);
        if (statuses.length === 0) {
            statusPanelElement.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
                "<div class=\"message is-warning\">" +
                "<div class=\"message-body\">There are no statuses associated with this record.</div>" +
                "</div>" +
                "</div>");
            return;
        }
        for (const [index, status] of statuses.entries()) {
            renderStatusFunction(status, index);
        }
    };
    const getStatuses = () => {
        crmEdit.clearPanelBlocksFunction(statusPanelElement);
        statuses = [];
        statusPanelElement.insertAdjacentHTML("beforeend", crmEdit.getLoadingPanelBlockHTML("Statuses"));
        cityssm.postJSON(urlPrefix + "/view/doGetStatuses", {
            recordID: crmEdit.recordID
        }, (responseJSON) => {
            if (responseJSON.success) {
                statuses = responseJSON.statuses;
                renderStatusesFunction();
            }
            else {
                statusPanelElement.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
                    "<div class=\"message is-danger\"><div class=\"message-body\">" +
                    responseJSON.message +
                    "</div></div>" +
                    "</div>");
            }
        });
    };
    renderStatusesFunction();
    const addStatusButtonElement = document.querySelector("#is-add-status-button");
    if (addStatusButtonElement) {
        addStatusButtonElement.addEventListener("click", () => {
            let closeAddModalFunction;
            const addFunction = (formEvent) => {
                formEvent.preventDefault();
                cityssm.postJSON(urlPrefix + "/edit/doAddStatus", formEvent.currentTarget, (responseJSON) => {
                    if (responseJSON.success) {
                        getStatuses();
                        closeAddModalFunction();
                    }
                    else {
                        cityssm.alertModal("Add Status Error", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                    }
                });
            };
            cityssm.openHtmlModal("status-add", {
                onshow: () => {
                    document.querySelector("#addStatus--recordID").value = crmEdit.recordID;
                    const statusTypeKeyElement = document.querySelector("#addStatus--statusTypeKey");
                    const statusTypes = exports.statusTypes;
                    for (const statusType of statusTypes) {
                        if (statusType.isActive) {
                            statusTypeKeyElement.insertAdjacentHTML("beforeend", "<option value=\"" + cityssm.escapeHTML(statusType.statusTypeKey) + "\">" +
                                cityssm.escapeHTML(statusType.statusType) +
                                "</option>");
                        }
                    }
                    const rightNow = new Date();
                    document.querySelector("#addStatus--statusDateString").value = cityssm.dateToString(rightNow);
                    document.querySelector("#addStatus--statusTimeString").value = cityssm.dateToTimeString(rightNow);
                },
                onshown: (_modalElement, closeModalFunction) => {
                    bulmaJS.toggleHtmlClipped();
                    closeAddModalFunction = closeModalFunction;
                    document.querySelector("#form--addStatus").addEventListener("submit", addFunction);
                },
                onremoved: () => {
                    bulmaJS.toggleHtmlClipped();
                }
            });
        });
    }
})();
