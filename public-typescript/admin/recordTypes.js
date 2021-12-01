"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const crmAdmin = exports.crmAdmin;
    const urlPrefix = exports.urlPrefix;
    const recordTypesContainerElement = document.querySelector("#container--recordTypes");
    const recordTypesFilterElement = document.querySelector("#statusTypesFilter--recordTypeKey");
    crmAdmin.recordTypes = [];
    const getRecordTypeFromEventFunction = (clickEvent) => {
        const buttonElement = clickEvent.currentTarget;
        const trElement = buttonElement.closest("tr");
        const recordTypeIndex = Number.parseInt(trElement.dataset.index, 10);
        const recordType = crmAdmin.recordTypes[recordTypeIndex];
        return {
            buttonElement,
            trElement,
            recordTypeIndex,
            recordType
        };
    };
    const toggleRecordTypeActiveFunction = (clickEvent) => {
        const { buttonElement, recordType } = getRecordTypeFromEventFunction(clickEvent);
        buttonElement.disabled = true;
        const newIsActive = !recordType.isActive;
        cityssm.postJSON(urlPrefix + "/admin/doSetRecordTypeIsActive", {
            recordTypeKey: recordType.recordTypeKey,
            isActive: newIsActive
        }, (responseJSON) => {
            buttonElement.disabled = false;
            if (responseJSON.success) {
                recordType.isActive = newIsActive;
                buttonElement.innerHTML = newIsActive
                    ? "<i class=\"fas fa-check\" aria-label=\"Active Record Type\"></i>"
                    : "<i class=\"fas fa-minus\" aria-label=\"False\"></i>";
            }
            else {
                cityssm.alertModal("Record Type Not Updated", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
            }
        });
    };
    const updateRecordTypeFunction = (clickEvent) => {
        const { recordType, recordTypeIndex } = getRecordTypeFromEventFunction(clickEvent);
        let formElement;
        let patternElement;
        let editRecordCloseModalFunction;
        let isSubmitting = false;
        const submitFunction = (formEvent) => {
            formEvent.preventDefault();
            if (isSubmitting) {
                return;
            }
            if (!crmAdmin.isValidRegex(patternElement.value)) {
                cityssm.alertModal("Regular Expression Pattern Invalid", "Please ensure you are using a valid regular expression.", "OK", "warning");
                return;
            }
            isSubmitting = true;
            cityssm.postJSON(urlPrefix + "/admin/doUpdateRecordType", formElement, (responseJSON) => {
                if (responseJSON.success) {
                    crmAdmin.recordTypes[recordTypeIndex] = responseJSON.recordType;
                    crmAdmin.recordTypes[recordTypeIndex].isActive = recordType.isActive;
                    crmAdmin.recordTypes[recordTypeIndex].recordCount = recordType.recordCount;
                    renderRecordTypesFunction();
                    editRecordCloseModalFunction();
                }
                else {
                    isSubmitting = false;
                    cityssm.alertModal("Error Updating Record Type", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                }
            });
        };
        cityssm.openHtmlModal("recordType-edit", {
            onshow: () => {
                formElement = document.querySelector("#form--editRecordType");
                document.querySelector("#editRecordType--recordTypeKey").value = recordType.recordTypeKey;
                document.querySelector("#editRecordType--recordType").value = recordType.recordType;
                document.querySelector("#editRecordType--minlength").value = recordType.minlength.toString();
                document.querySelector("#editRecordType--maxlength").value = recordType.maxlength.toString();
                patternElement = document.querySelector("#editRecordType--pattern");
                patternElement.value = recordType.pattern;
                patternElement.addEventListener("keyup", () => {
                    if (crmAdmin.isValidRegex(patternElement.value)) {
                        patternElement.classList.remove("is-danger");
                    }
                    else {
                        patternElement.classList.add("is-danger");
                    }
                });
                document.querySelector("#editRecordType--patternHelp").value = recordType.patternHelp;
                formElement.addEventListener("submit", submitFunction);
            },
            onshown: (_modalElement, closeModalFunction) => {
                editRecordCloseModalFunction = closeModalFunction;
            }
        });
    };
    const removeRecordTypeFunction = (clickEvent) => {
        const { recordType, recordTypeIndex } = getRecordTypeFromEventFunction(clickEvent);
        const removeFunction = () => {
            cityssm.postJSON(urlPrefix + "/admin/doRemoveRecordType", {
                recordTypeKey: recordType.recordTypeKey
            }, (responseJSON) => {
                if (responseJSON.success) {
                    crmAdmin.recordTypes.splice(recordTypeIndex, 1);
                    renderRecordTypesFunction();
                }
                else {
                    cityssm.alertModal("Error Removing Record Type", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                }
            });
        };
        cityssm.confirmModal("Remove Record Type", "Are you sure you want to remove the \"" + cityssm.escapeHTML(recordType.recordType) + "\" record type?", "Yes, Remove It", "warning", removeFunction);
    };
    const renderRecordTypesFunction = () => {
        recordTypesFilterElement.innerHTML = "";
        if (crmAdmin.recordTypes.length === 0) {
            recordTypesContainerElement.innerHTML = "<div class=\"message is-warning\">" +
                "<p class=\"message-body\">" +
                "<strong>There are no record types in the system.</strong><br />" +
                "Please create at least one record type." +
                "</p>" +
                "</div>";
            return;
        }
        const tableElement = document.createElement("table");
        tableElement.className = "table is-fullwidth is-bordered is-striped is-hoverable has-sticky-header";
        tableElement.innerHTML = "<thead>" +
            "<tr>" +
            "<th>Record Type</th>" +
            "<th class=\"has-text-centered\">Is Active</th>" +
            "<th class=\"has-text-centered\">Length</th>" +
            "<th class=\"has-text-centered\">Pattern</th>" +
            "<th class=\"has-text-centered\">Options</th>" +
            "</tr>" +
            "</thead>" +
            "<tbody></tbody>";
        const tbodyElement = tableElement.querySelector("tbody");
        for (let index = 0; index < crmAdmin.recordTypes.length; index += 1) {
            const recordType = crmAdmin.recordTypes[index];
            const trElement = document.createElement("tr");
            trElement.dataset.index = index.toString();
            trElement.innerHTML = "<th class=\"is-vcentered\">" +
                recordType.recordType + "<br />" +
                "<span class=\"is-size-7\"><i class=\"fas fa-key\" aria-hidden=\"true\"></i> " + recordType.recordTypeKey + "</span>" +
                "</th>" +
                ("<td class=\"has-text-centered\">" +
                    "<button class=\"button is-inverted is-info is-toggle-active-button\" type=\"button\">" +
                    (recordType.isActive
                        ? "<i class=\"fas fa-check\" aria-label=\"Active Record Type\"></i>"
                        : "<i class=\"fas fa-minus\" aria-label=\"False\"></i>") +
                    "</button>" +
                    "</td>") +
                ("<td class=\"has-text-centered\">" +
                    recordType.minlength.toString() + " - " + recordType.maxlength.toString() +
                    "</td>") +
                ("<td class=\"has-text-centered\">" +
                    cityssm.escapeHTML(recordType.pattern) + "<br />" +
                    "<span class=\"is-size-7\">" + cityssm.escapeHTML(recordType.patternHelp) + "</span>" +
                    "</td>") +
                ("<td class=\"has-text-centered\">" +
                    "<button class=\"button is-inverted is-info is-update-button\" type=\"button\">" +
                    "<i class=\"fas fa-pencil-alt\" aria-label=\"Update Record Type\"></i>" +
                    "</button>" +
                    (recordType.recordCount === 0
                        ? " <button class=\"button is-inverted is-danger is-remove-button\" type=\"button\">" +
                            "<i class=\"fas fa-trash-alt\" aria-label=\"Remove Record Type\"></i>" +
                            "</button>"
                        : "") +
                    "</td>");
            trElement.querySelector(".is-toggle-active-button").addEventListener("click", toggleRecordTypeActiveFunction);
            trElement.querySelector(".is-update-button").addEventListener("click", updateRecordTypeFunction);
            if (recordType.recordCount === 0) {
                trElement.querySelector(".is-remove-button").addEventListener("click", removeRecordTypeFunction);
            }
            tbodyElement.append(trElement);
            const optionElement = document.createElement("option");
            optionElement.value = recordType.recordTypeKey;
            optionElement.textContent = recordType.recordType;
            recordTypesFilterElement.append(optionElement);
        }
        cityssm.clearElement(recordTypesContainerElement);
        recordTypesContainerElement.append(tableElement);
    };
    crmAdmin.getRecordTypesFunction = (callbackFunction) => {
        crmAdmin.recordTypes = [];
        recordTypesFilterElement.innerHTML = "";
        cityssm.clearElement(recordTypesContainerElement);
        recordTypesContainerElement.innerHTML = crmAdmin.getLoadingHTML("Record Types");
        cityssm.postJSON(urlPrefix + "/admin/doGetRecordTypes", {}, (responseJSON) => {
            crmAdmin.recordTypes = responseJSON.recordTypes;
            renderRecordTypesFunction();
            if (callbackFunction) {
                callbackFunction();
            }
        });
    };
    document.querySelector("#is-add-record-type-button").addEventListener("click", () => {
        let formElement;
        let patternElement;
        let addRecordCloseModalFunction;
        let isSubmitting = false;
        const submitFunction = (formEvent) => {
            formEvent.preventDefault();
            if (isSubmitting) {
                return;
            }
            if (!crmAdmin.isValidRegex(patternElement.value)) {
                cityssm.alertModal("Regular Expression Pattern Invalid", "Please ensure you are using a valid regular expression.", "OK", "warning");
                return;
            }
            isSubmitting = true;
            cityssm.postJSON(urlPrefix + "/admin/doAddRecordType", formElement, (responseJSON) => {
                if (responseJSON.success) {
                    crmAdmin.recordTypes.unshift(responseJSON.recordType);
                    renderRecordTypesFunction();
                    addRecordCloseModalFunction();
                }
                else {
                    isSubmitting = false;
                    cityssm.alertModal("Error Adding Record Type", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                }
            });
        };
        cityssm.openHtmlModal("recordType-add", {
            onshow: () => {
                formElement = document.querySelector("#form--addRecordType");
                patternElement = document.querySelector("#addRecordType--pattern");
                patternElement.addEventListener("keyup", () => {
                    if (crmAdmin.isValidRegex(patternElement.value)) {
                        patternElement.classList.remove("is-danger");
                    }
                    else {
                        patternElement.classList.add("is-danger");
                    }
                });
                formElement.addEventListener("submit", submitFunction);
            },
            onshown: (_modalElement, closeModalFunction) => {
                addRecordCloseModalFunction = closeModalFunction;
            }
        });
    });
})();
