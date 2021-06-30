"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const crmAdmin = exports.crmAdmin;
    const urlPrefix = exports.urlPrefix;
    const recordTypesContainerEle = document.querySelector("#container--recordTypes");
    const recordTypesFilterEle = document.querySelector("#statusTypesFilter--recordTypeKey");
    crmAdmin.recordTypes = [];
    const getRecordTypeFromEventFunction = (clickEvent) => {
        const buttonEle = clickEvent.currentTarget;
        const trEle = buttonEle.closest("tr");
        const recordTypeIndex = Number.parseInt(trEle.dataset.index, 10);
        const recordType = crmAdmin.recordTypes[recordTypeIndex];
        return {
            buttonEle,
            trEle,
            recordTypeIndex,
            recordType
        };
    };
    const toggleRecordTypeActiveFunction = (clickEvent) => {
        const { buttonEle, recordType } = getRecordTypeFromEventFunction(clickEvent);
        buttonEle.disabled = true;
        const newIsActive = !recordType.isActive;
        cityssm.postJSON(urlPrefix + "/admin/doSetRecordTypeIsActive", {
            recordTypeKey: recordType.recordTypeKey,
            isActive: newIsActive
        }, (responseJSON) => {
            buttonEle.disabled = false;
            if (responseJSON.success) {
                recordType.isActive = newIsActive;
                buttonEle.innerHTML = newIsActive
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
        let formEle;
        let patternEle;
        let editRecordCloseModalFunction;
        let isSubmitting = false;
        const submitFunction = (formEvent) => {
            formEvent.preventDefault();
            if (isSubmitting) {
                return;
            }
            if (!crmAdmin.isValidRegex(patternEle.value)) {
                cityssm.alertModal("Regular Expression Pattern Invalid", "Please ensure you are using a valid regular expression.", "OK", "warning");
                return;
            }
            isSubmitting = true;
            cityssm.postJSON(urlPrefix + "/admin/doUpdateRecordType", formEle, (responseJSON) => {
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
                formEle = document.querySelector("#form--editRecordType");
                document.querySelector("#editRecordType--recordTypeKey").value = recordType.recordTypeKey;
                document.querySelector("#editRecordType--recordType").value = recordType.recordType;
                document.querySelector("#editRecordType--minlength").value = recordType.minlength.toString();
                document.querySelector("#editRecordType--maxlength").value = recordType.maxlength.toString();
                patternEle = document.querySelector("#editRecordType--pattern");
                patternEle.value = recordType.pattern;
                patternEle.addEventListener("keyup", () => {
                    if (crmAdmin.isValidRegex(patternEle.value)) {
                        patternEle.classList.remove("is-danger");
                    }
                    else {
                        patternEle.classList.add("is-danger");
                    }
                });
                document.querySelector("#editRecordType--patternHelp").value = recordType.patternHelp;
                formEle.addEventListener("submit", submitFunction);
            },
            onshown: (_modalEle, closeModalFunction) => {
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
        recordTypesFilterEle.innerHTML = "";
        if (crmAdmin.recordTypes.length === 0) {
            recordTypesContainerEle.innerHTML = "<div class=\"message is-warning\">" +
                "<p class=\"message-body\">" +
                "<strong>There are no record types in the system.</strong><br />" +
                "Please create at least one record type." +
                "</p>" +
                "</div>";
            return;
        }
        const tableEle = document.createElement("table");
        tableEle.className = "table is-fullwidth is-bordered is-striped is-hoverable has-sticky-header";
        tableEle.innerHTML = "<thead>" +
            "<tr>" +
            "<th>Record Type</th>" +
            "<th class=\"has-text-centered\">Is Active</th>" +
            "<th class=\"has-text-centered\">Length</th>" +
            "<th class=\"has-text-centered\">Pattern</th>" +
            "<th class=\"has-text-centered\">Options</th>" +
            "</tr>" +
            "</thead>" +
            "<tbody></tbody>";
        const tbodyEle = tableEle.querySelector("tbody");
        for (let index = 0; index < crmAdmin.recordTypes.length; index += 1) {
            const recordType = crmAdmin.recordTypes[index];
            const trEle = document.createElement("tr");
            trEle.dataset.index = index.toString();
            trEle.innerHTML = "<th class=\"is-vcentered\">" +
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
            trEle.querySelector(".is-toggle-active-button").addEventListener("click", toggleRecordTypeActiveFunction);
            trEle.querySelector(".is-update-button").addEventListener("click", updateRecordTypeFunction);
            if (recordType.recordCount === 0) {
                trEle.querySelector(".is-remove-button").addEventListener("click", removeRecordTypeFunction);
            }
            tbodyEle.append(trEle);
            const optionEle = document.createElement("option");
            optionEle.value = recordType.recordTypeKey;
            optionEle.textContent = recordType.recordType;
            recordTypesFilterEle.append(optionEle);
        }
        cityssm.clearElement(recordTypesContainerEle);
        recordTypesContainerEle.append(tableEle);
    };
    crmAdmin.getRecordTypesFunction = (callbackFunction) => {
        crmAdmin.recordTypes = [];
        recordTypesFilterEle.innerHTML = "";
        cityssm.clearElement(recordTypesContainerEle);
        recordTypesContainerEle.innerHTML = crmAdmin.getLoadingHTML("Record Types");
        cityssm.postJSON(urlPrefix + "/admin/doGetRecordTypes", {}, (responseJSON) => {
            crmAdmin.recordTypes = responseJSON.recordTypes;
            renderRecordTypesFunction();
            if (callbackFunction) {
                callbackFunction();
            }
        });
    };
    document.querySelector("#is-add-record-type-button").addEventListener("click", () => {
        let formEle;
        let patternEle;
        let addRecordCloseModalFunction;
        let isSubmitting = false;
        const submitFunction = (formEvent) => {
            formEvent.preventDefault();
            if (isSubmitting) {
                return;
            }
            if (!crmAdmin.isValidRegex(patternEle.value)) {
                cityssm.alertModal("Regular Expression Pattern Invalid", "Please ensure you are using a valid regular expression.", "OK", "warning");
                return;
            }
            isSubmitting = true;
            cityssm.postJSON(urlPrefix + "/admin/doAddRecordType", formEle, (responseJSON) => {
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
                formEle = document.querySelector("#form--addRecordType");
                patternEle = document.querySelector("#addRecordType--pattern");
                patternEle.addEventListener("keyup", () => {
                    if (crmAdmin.isValidRegex(patternEle.value)) {
                        patternEle.classList.remove("is-danger");
                    }
                    else {
                        patternEle.classList.add("is-danger");
                    }
                });
                formEle.addEventListener("submit", submitFunction);
            },
            onshown: (_modalEle, closeModalFunction) => {
                addRecordCloseModalFunction = closeModalFunction;
            }
        });
    });
})();
