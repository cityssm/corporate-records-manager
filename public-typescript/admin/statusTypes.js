"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const crmAdmin = exports.crmAdmin;
    const urlPrefix = exports.urlPrefix;
    const statusTypesContainerEle = document.querySelector("#container--statusTypes");
    const recordTypesFilterEle = document.querySelector("#statusTypesFilter--recordTypeKey");
    let statusTypes = [];
    const getStatusTypeFromEventFunction = (clickEvent) => {
        const buttonEle = clickEvent.currentTarget;
        const trEle = buttonEle.closest("tr");
        const statusTypeIndex = Number.parseInt(trEle.getAttribute("data-index"), 10);
        const statusType = statusTypes[statusTypeIndex];
        return {
            buttonEle,
            trEle,
            statusTypeIndex,
            statusType
        };
    };
    const toggleStatusTypeActiveFunction = (clickEvent) => {
        const { buttonEle, statusType } = getStatusTypeFromEventFunction(clickEvent);
        buttonEle.disabled = true;
        const newIsActive = !statusType.isActive;
        cityssm.postJSON(urlPrefix + "/admin/doSetStatusTypeIsActive", {
            statusTypeKey: statusType.statusTypeKey,
            isActive: newIsActive
        }, (responseJSON) => {
            buttonEle.disabled = false;
            if (responseJSON.success) {
                statusType.isActive = newIsActive;
                buttonEle.innerHTML = newIsActive
                    ? "<i class=\"fas fa-check\" aria-label=\"Active Status Type\"></i>"
                    : "<i class=\"fas fa-minus\" aria-label=\"False\"></i>";
            }
            else {
                cityssm.alertModal("Status Type Not Updated", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
            }
        });
    };
    const moveStatusTypeFunction = (clickEvent, orderNumberDirection) => {
        const { buttonEle, statusType } = getStatusTypeFromEventFunction(clickEvent);
        buttonEle.disabled = true;
        const newOrderNumber = statusType.orderNumber + orderNumberDirection;
        cityssm.postJSON(urlPrefix + "/admin/doSetStatusTypeOrderNumber", {
            statusTypeKey: statusType.statusTypeKey,
            orderNumber: newOrderNumber
        }, (responseJSON) => {
            if (responseJSON.success) {
                statusTypes = responseJSON.statusTypes;
                renderStatusTypesFunction();
            }
            else {
                cityssm.alertModal("Error Moving Status Type", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
            }
        });
    };
    const moveStatusTypeUpFunction = (clickEvent) => {
        moveStatusTypeFunction(clickEvent, -1);
    };
    const moveStatusTypeDownFunction = (clickEvent) => {
        moveStatusTypeFunction(clickEvent, 1);
    };
    const updateStatusTypeFunction = (clickEvent) => {
        const { statusType } = getStatusTypeFromEventFunction(clickEvent);
        let formEle;
        let updateStatusTypeCloseModalFunction;
        const submitFunction = (formEvent) => {
            formEvent.preventDefault();
            cityssm.postJSON(urlPrefix + "/admin/doUpdateStatusType", formEle, (responseJSON) => {
                if (responseJSON.success) {
                    updateStatusTypeCloseModalFunction();
                    statusTypes = responseJSON.statusTypes;
                    renderStatusTypesFunction();
                }
                else {
                    cityssm.alertModal("Error Updating Status Type", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                }
            });
        };
        cityssm.openHtmlModal("statusType-edit", {
            onshow: () => {
                document.querySelector("#editStatusType--statusTypeKey").value = statusType.statusTypeKey;
                document.querySelector("#editStatusType--statusType").value = statusType.statusType;
                formEle = document.querySelector("#form--editStatusType");
                formEle.addEventListener("submit", submitFunction);
            },
            onshown: (_modalEle, closeModalFunction) => {
                updateStatusTypeCloseModalFunction = closeModalFunction;
            }
        });
    };
    const removeStatusTypeFunction = (clickEvent) => {
        const { statusType } = getStatusTypeFromEventFunction(clickEvent);
        const removeFunction = () => {
            cityssm.postJSON(urlPrefix + "/admin/doRemoveStatusType", {
                statusTypeKey: statusType.statusTypeKey
            }, (responseJSON) => {
                if (responseJSON.success) {
                    statusTypes = responseJSON.statusTypes;
                    renderStatusTypesFunction();
                }
                else {
                    cityssm.alertModal("Error Removing Status Type", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                }
            });
        };
        cityssm.confirmModal("Remove Status Type", "Are you sure you want to remove the \"" + cityssm.escapeHTML(statusType.statusType) + "\" status type?", "Yes, Remove It", "warning", removeFunction);
    };
    const renderStatusTypesFunction = () => {
        const recordTypeKey = recordTypesFilterEle.value;
        let hasStatusTypes = false;
        const tableEle = document.createElement("table");
        tableEle.className = "table is-fullwidth is-bordered is-striped is-hoverable has-sticky-header";
        tableEle.innerHTML = "<thead>" +
            "<tr>" +
            "<th>Status Type</th>" +
            "<th class=\"has-text-centered\">Is Active</th>" +
            "<th class=\"has-text-centered\">Order</th>" +
            "<th class=\"has-text-centered\">Options</th>" +
            "</tr>" +
            "</thead>" +
            "<tbody></tbody>";
        const tbodyEle = tableEle.querySelectorAll("tbody")[0];
        for (const [index, statusType] of statusTypes.entries()) {
            if (recordTypeKey !== statusType.recordTypeKey) {
                continue;
            }
            const trEle = document.createElement("tr");
            trEle.dataset.index = index.toString();
            trEle.innerHTML = "<th class=\"is-vcentered\">" +
                statusType.statusType + "<br />" +
                "<span class=\"is-size-7\"><i class=\"fas fa-key\" aria-hidden=\"true\"></i> " + statusType.statusTypeKey + "</span>" +
                "</th>" +
                ("<td class=\"has-text-centered\">" +
                    "<button class=\"button is-inverted is-info is-toggle-active-button\" type=\"button\">" +
                    (statusType.isActive
                        ? "<i class=\"fas fa-check\" aria-label=\"Active Status Type\"></i>"
                        : "<i class=\"fas fa-minus\" aria-label=\"False\"></i>") +
                    "</button>" +
                    "</td>") +
                ("<td class=\"has-text-centered\">" +
                    "<button class=\"button is-inverted is-info is-up-button\" type=\"button\">" +
                    "<i class=\"fas fa-arrow-up\" aria-label=\"Move Status Type Up\"></i>" +
                    "</button>" +
                    " <button class=\"button is-inverted is-info is-down-button\" type=\"button\">" +
                    "<i class=\"fas fa-arrow-down\" aria-label=\"Move Status Type Down\"></i>" +
                    "</button>" +
                    "</td>") +
                ("<td class=\"has-text-centered\">" +
                    "<button class=\"button is-inverted is-info is-update-button\" type=\"button\">" +
                    "<i class=\"fas fa-pencil-alt\" aria-label=\"Update Status Type\"></i>" +
                    "</button>" +
                    (statusType.recordCount === 0
                        ? " <button class=\"button is-inverted is-danger is-remove-button\" type=\"button\">" +
                            "<i class=\"fas fa-trash-alt\" aria-label=\"Remove Status Type\"></i>" +
                            "</button>"
                        : "") +
                    "</td>");
            trEle.querySelectorAll(".is-toggle-active-button")[0].addEventListener("click", toggleStatusTypeActiveFunction);
            trEle.querySelectorAll(".is-up-button")[0].addEventListener("click", moveStatusTypeUpFunction);
            trEle.querySelectorAll(".is-down-button")[0].addEventListener("click", moveStatusTypeDownFunction);
            trEle.querySelectorAll(".is-update-button")[0].addEventListener("click", updateStatusTypeFunction);
            if (statusType.recordCount === 0) {
                trEle.querySelectorAll(".is-remove-button")[0].addEventListener("click", removeStatusTypeFunction);
            }
            tbodyEle.append(trEle);
            hasStatusTypes = true;
        }
        cityssm.clearElement(statusTypesContainerEle);
        if (hasStatusTypes) {
            const trEles = tbodyEle.querySelectorAll("tr");
            trEles[0].querySelectorAll(".is-up-button")[0].disabled = true;
            trEles[trEles.length - 1].querySelectorAll(".is-down-button")[0].disabled = true;
            statusTypesContainerEle.append(tableEle);
        }
        else {
            statusTypesContainerEle.innerHTML = "<div class=\"message is-info\">" +
                "<p class=\"message-body\">There are no status types associated with the selected record type.</p>" +
                "</div>";
        }
    };
    crmAdmin.getStatusTypesFunction = () => {
        statusTypes = [];
        cityssm.clearElement(statusTypesContainerEle);
        statusTypesContainerEle.innerHTML = crmAdmin.getLoadingHTML("Status Types");
        cityssm.postJSON(urlPrefix + "/admin/doGetStatusTypes", {}, (responseJSON) => {
            statusTypes = responseJSON.statusTypes;
            renderStatusTypesFunction();
        });
    };
    recordTypesFilterEle.addEventListener("change", renderStatusTypesFunction);
    document.querySelector("#is-add-status-type-button").addEventListener("click", () => {
        let addStatusTypeCloseModalFunction;
        let formEle;
        const submitFunction = (formEvent) => {
            formEvent.preventDefault();
            cityssm.postJSON(urlPrefix + "/admin/doAddStatusType", formEle, (responseJSON) => {
                if (responseJSON.success) {
                    addStatusTypeCloseModalFunction();
                    statusTypes = responseJSON.statusTypes;
                    renderStatusTypesFunction();
                }
                else {
                    cityssm.alertModal("Error Adding Status Type", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                }
            });
        };
        cityssm.openHtmlModal("statusType-add", {
            onshow: () => {
                const recordType = crmAdmin.recordTypes.find((currentRecordType) => {
                    return currentRecordType.recordTypeKey === recordTypesFilterEle.value;
                });
                document.querySelector("#addStatusType--recordType").textContent = recordType.recordType;
                document.querySelector("#addStatusType--recordTypeKey").value = recordTypesFilterEle.value;
                formEle = document.querySelector("#form--addStatusType");
                formEle.addEventListener("submit", submitFunction);
            },
            onshown: (_modalEle, closeModalFunction) => {
                addStatusTypeCloseModalFunction = closeModalFunction;
            }
        });
    });
})();
