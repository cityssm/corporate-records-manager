"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const crmAdmin = exports.crmAdmin;
    const urlPrefix = exports.urlPrefix;
    const recordUserTypesContainerElement = document.querySelector("#container--recordUserTypes");
    let recordUserTypes = [];
    const getRecordUserTypeFromEventFunction = (clickEvent) => {
        const buttonElement = clickEvent.currentTarget;
        const trElement = buttonElement.closest("tr");
        const recordUserTypeIndex = Number.parseInt(trElement.dataset.index, 10);
        const recordUserType = recordUserTypes[recordUserTypeIndex];
        return {
            buttonElement,
            trElement,
            recordUserTypeIndex,
            recordUserType
        };
    };
    const toggleRecordUserTypeActiveFunction = (clickEvent) => {
        const { buttonElement, recordUserType } = getRecordUserTypeFromEventFunction(clickEvent);
        buttonElement.disabled = true;
        const newIsActive = !recordUserType.isActive;
        cityssm.postJSON(urlPrefix + "/admin/doSetRecordUserTypeIsActive", {
            recordUserTypeKey: recordUserType.recordUserTypeKey,
            isActive: newIsActive
        }, (responseJSON) => {
            buttonElement.disabled = false;
            if (responseJSON.success) {
                recordUserType.isActive = newIsActive;
                buttonElement.innerHTML = newIsActive
                    ? "<i class=\"fas fa-check\" aria-label=\"Active Record User Type\"></i>"
                    : "<i class=\"fas fa-minus\" aria-label=\"False\"></i>";
            }
            else {
                cityssm.alertModal("Record User Type Not Updated", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
            }
        });
    };
    const updateRecordUserTypeFunction = (clickEvent) => {
        const { recordUserType, recordUserTypeIndex } = getRecordUserTypeFromEventFunction(clickEvent);
        let formElement;
        let editRecordUserCloseModalFunction;
        let isSubmitting = false;
        const submitFunction = (formEvent) => {
            formEvent.preventDefault();
            if (isSubmitting) {
                return;
            }
            isSubmitting = true;
            cityssm.postJSON(urlPrefix + "/admin/doUpdateRecordUserType", formElement, (responseJSON) => {
                if (responseJSON.success) {
                    recordUserTypes[recordUserTypeIndex] = responseJSON.recordUserType;
                    recordUserTypes[recordUserTypeIndex].isActive = recordUserType.isActive;
                    recordUserTypes[recordUserTypeIndex].recordCount = recordUserType.recordCount;
                    renderRecordUserTypesFunction();
                    editRecordUserCloseModalFunction();
                }
                else {
                    isSubmitting = false;
                    cityssm.alertModal("Error Updating Record User Type", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                }
            });
        };
        cityssm.openHtmlModal("recordUserType-edit", {
            onshow: () => {
                formElement = document.querySelector("#form--editRecordUserType");
                document.querySelector("#editRecordUserType--recordUserTypeKey").value = recordUserType.recordUserTypeKey;
                document.querySelector("#editRecordUserType--recordUserType").value = recordUserType.recordUserType;
                formElement.addEventListener("submit", submitFunction);
            },
            onshown: (_modalElement, closeModalFunction) => {
                editRecordUserCloseModalFunction = closeModalFunction;
            }
        });
    };
    const removeRecordUserTypeFunction = (clickEvent) => {
        const { recordUserType, recordUserTypeIndex } = getRecordUserTypeFromEventFunction(clickEvent);
        const removeFunction = () => {
            cityssm.postJSON(urlPrefix + "/admin/doRemoveRecordUserType", {
                recordUserTypeKey: recordUserType.recordUserTypeKey
            }, (responseJSON) => {
                if (responseJSON.success) {
                    recordUserTypes.splice(recordUserTypeIndex, 1);
                    renderRecordUserTypesFunction();
                }
                else {
                    cityssm.alertModal("Error Removing Record User Type", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                }
            });
        };
        cityssm.confirmModal("Remove Record User Type", "Are you sure you want to remove the \"" + cityssm.escapeHTML(recordUserType.recordUserType) + "\" user type?", "Yes, Remove It", "warning", removeFunction);
    };
    const renderRecordUserTypesFunction = () => {
        if (recordUserTypes.length === 0) {
            recordUserTypesContainerElement.innerHTML = "<div class=\"message is-warning\">" +
                "<p class=\"message-body\">" +
                "<strong>There are no user types in the system.</strong><br />" +
                "Please create at least one record type." +
                "</p>" +
                "</div>";
            return;
        }
        const tableElement = document.createElement("table");
        tableElement.className = "table is-fullwidth is-bordered is-striped is-hoverable has-sticky-header";
        tableElement.innerHTML = "<thead>" +
            "<tr>" +
            "<th>Record User Type</th>" +
            "<th class=\"has-text-centered\">Is Active</th>" +
            "<th class=\"has-text-centered\">Options</th>" +
            "</tr>" +
            "</thead>" +
            "<tbody></tbody>";
        const tbodyElement = tableElement.querySelector("tbody");
        for (const [index, recordUserType] of recordUserTypes.entries()) {
            const trElement = document.createElement("tr");
            trElement.dataset.index = index.toString();
            trElement.innerHTML = "<th class=\"is-vcentered\">" +
                recordUserType.recordUserType + "<br />" +
                "<span class=\"is-size-7\"><i class=\"fas fa-key\" aria-hidden=\"true\"></i> " + recordUserType.recordUserTypeKey + "</span>" +
                "</th>" +
                ("<td class=\"has-text-centered\">" +
                    "<button class=\"button is-inverted is-info is-toggle-active-button\" type=\"button\">" +
                    (recordUserType.isActive
                        ? "<i class=\"fas fa-check\" aria-label=\"Active User Type\"></i>"
                        : "<i class=\"fas fa-minus\" aria-label=\"False\"></i>") +
                    "</button>" +
                    "</td>") +
                ("<td class=\"has-text-centered\">" +
                    "<button class=\"button is-inverted is-info is-update-button\" type=\"button\">" +
                    "<i class=\"fas fa-pencil-alt\" aria-label=\"Update Record Type\"></i>" +
                    "</button>" +
                    (recordUserType.recordCount === 0
                        ? " <button class=\"button is-inverted is-danger is-remove-button\" type=\"button\">" +
                            "<i class=\"fas fa-trash-alt\" aria-label=\"Remove Record User Type\"></i>" +
                            "</button>"
                        : "") +
                    "</td>");
            trElement.querySelector(".is-toggle-active-button").addEventListener("click", toggleRecordUserTypeActiveFunction);
            trElement.querySelector(".is-update-button").addEventListener("click", updateRecordUserTypeFunction);
            if (recordUserType.recordCount === 0) {
                trElement.querySelector(".is-remove-button").addEventListener("click", removeRecordUserTypeFunction);
            }
            tbodyElement.append(trElement);
        }
        cityssm.clearElement(recordUserTypesContainerElement);
        recordUserTypesContainerElement.append(tableElement);
    };
    crmAdmin.getRecordUserTypesFunction = (callbackFunction) => {
        recordUserTypes = [];
        cityssm.clearElement(recordUserTypesContainerElement);
        recordUserTypesContainerElement.innerHTML = crmAdmin.getLoadingHTML("Record User Types");
        cityssm.postJSON(urlPrefix + "/admin/doGetRecordUserTypes", {}, (responseJSON) => {
            recordUserTypes = responseJSON.recordUserTypes;
            renderRecordUserTypesFunction();
            if (callbackFunction) {
                callbackFunction();
            }
        });
    };
    document.querySelector("#is-add-record-user-type-button").addEventListener("click", () => {
        let formElement;
        let addRecordUserCloseModalFunction;
        let isSubmitting = false;
        const submitFunction = (formEvent) => {
            formEvent.preventDefault();
            if (isSubmitting) {
                return;
            }
            isSubmitting = true;
            cityssm.postJSON(urlPrefix + "/admin/doAddRecordUserType", formElement, (responseJSON) => {
                if (responseJSON.success) {
                    recordUserTypes.unshift(responseJSON.recordUserType);
                    renderRecordUserTypesFunction();
                    addRecordUserCloseModalFunction();
                }
                else {
                    isSubmitting = false;
                    cityssm.alertModal("Error Adding Record User Type", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                }
            });
        };
        cityssm.openHtmlModal("recordUserType-add", {
            onshow: () => {
                formElement = document.querySelector("#form--addRecordUserType");
                formElement.addEventListener("submit", submitFunction);
            },
            onshown: (_modalElement, closeModalFunction) => {
                addRecordUserCloseModalFunction = closeModalFunction;
            }
        });
    });
})();
