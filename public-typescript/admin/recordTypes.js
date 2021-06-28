"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(function () {
    var crmAdmin = exports.crmAdmin;
    var urlPrefix = exports.urlPrefix;
    var recordTypesContainerEle = document.getElementById("container--recordTypes");
    var recordTypesFilterEle = document.getElementById("statusTypesFilter--recordTypeKey");
    crmAdmin.recordTypes = [];
    var getRecordTypeFromEventFn = function (clickEvent) {
        var buttonEle = clickEvent.currentTarget;
        var trEle = buttonEle.closest("tr");
        var recordTypeIndex = parseInt(trEle.getAttribute("data-index"), 10);
        var recordType = crmAdmin.recordTypes[recordTypeIndex];
        return {
            buttonEle: buttonEle,
            trEle: trEle,
            recordTypeIndex: recordTypeIndex,
            recordType: recordType
        };
    };
    var toggleRecordTypeActiveFn = function (clickEvent) {
        var _a = getRecordTypeFromEventFn(clickEvent), buttonEle = _a.buttonEle, recordType = _a.recordType;
        buttonEle.disabled = true;
        var newIsActive = !recordType.isActive;
        cityssm.postJSON(urlPrefix + "/admin/doSetRecordTypeIsActive", {
            recordTypeKey: recordType.recordTypeKey,
            isActive: newIsActive
        }, function (responseJSON) {
            buttonEle.disabled = false;
            if (responseJSON.success) {
                recordType.isActive = newIsActive;
                if (newIsActive) {
                    buttonEle.innerHTML = "<i class=\"fas fa-check\" aria-label=\"Active Record Type\"></i>";
                }
                else {
                    buttonEle.innerHTML = "<i class=\"fas fa-minus\" aria-label=\"False\"></i>";
                }
            }
            else {
                cityssm.alertModal("Record Type Not Updated", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
            }
        });
    };
    var updateRecordTypeFn = function (clickEvent) {
        var _a = getRecordTypeFromEventFn(clickEvent), recordType = _a.recordType, recordTypeIndex = _a.recordTypeIndex;
        var formEle;
        var patternEle;
        var editRecordCloseModalFn;
        var isSubmitting = false;
        var submitFn = function (formEvent) {
            formEvent.preventDefault();
            if (isSubmitting) {
                return;
            }
            if (!crmAdmin.isValidRegex(patternEle.value)) {
                cityssm.alertModal("Regular Expression Pattern Invalid", "Please ensure you are using a valid regular expression.", "OK", "warning");
                return;
            }
            isSubmitting = true;
            cityssm.postJSON(urlPrefix + "/admin/doUpdateRecordType", formEle, function (responseJSON) {
                if (responseJSON.success) {
                    crmAdmin.recordTypes[recordTypeIndex] = responseJSON.recordType;
                    crmAdmin.recordTypes[recordTypeIndex].isActive = recordType.isActive;
                    crmAdmin.recordTypes[recordTypeIndex].recordCount = recordType.recordCount;
                    renderRecordTypesFn();
                    editRecordCloseModalFn();
                }
                else {
                    isSubmitting = false;
                    cityssm.alertModal("Error Updating Record Type", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                }
            });
        };
        cityssm.openHtmlModal("recordType-edit", {
            onshow: function () {
                formEle = document.getElementById("form--editRecordType");
                document.getElementById("editRecordType--recordTypeKey").value = recordType.recordTypeKey;
                document.getElementById("editRecordType--recordType").value = recordType.recordType;
                document.getElementById("editRecordType--minlength").value = recordType.minlength.toString();
                document.getElementById("editRecordType--maxlength").value = recordType.maxlength.toString();
                patternEle = document.getElementById("editRecordType--pattern");
                patternEle.value = recordType.pattern;
                patternEle.addEventListener("keyup", function () {
                    if (crmAdmin.isValidRegex(patternEle.value)) {
                        patternEle.classList.remove("is-danger");
                    }
                    else {
                        patternEle.classList.add("is-danger");
                    }
                });
                document.getElementById("editRecordType--patternHelp").value = recordType.patternHelp;
                formEle.addEventListener("submit", submitFn);
            },
            onshown: function (_modalEle, closeModalFn) {
                editRecordCloseModalFn = closeModalFn;
            }
        });
    };
    var removeRecordTypeFn = function (clickEvent) {
        var _a = getRecordTypeFromEventFn(clickEvent), recordType = _a.recordType, recordTypeIndex = _a.recordTypeIndex;
        var removeFn = function () {
            cityssm.postJSON(urlPrefix + "/admin/doRemoveRecordType", {
                recordTypeKey: recordType.recordTypeKey
            }, function (responseJSON) {
                if (responseJSON.success) {
                    crmAdmin.recordTypes.splice(recordTypeIndex, 1);
                    renderRecordTypesFn();
                }
                else {
                    cityssm.alertModal("Error Removing Record Type", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                }
            });
        };
        cityssm.confirmModal("Remove Record Type", "Are you sure you want to remove the \"" + cityssm.escapeHTML(recordType.recordType) + "\" record type?", "Yes, Remove It", "warning", removeFn);
    };
    var renderRecordTypesFn = function () {
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
        var tableEle = document.createElement("table");
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
        var tbodyEle = tableEle.getElementsByTagName("tbody")[0];
        for (var index = 0; index < crmAdmin.recordTypes.length; index += 1) {
            var recordType = crmAdmin.recordTypes[index];
            var trEle = document.createElement("tr");
            trEle.setAttribute("data-index", index.toString());
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
            trEle.getElementsByClassName("is-toggle-active-button")[0].addEventListener("click", toggleRecordTypeActiveFn);
            trEle.getElementsByClassName("is-update-button")[0].addEventListener("click", updateRecordTypeFn);
            if (recordType.recordCount === 0) {
                trEle.getElementsByClassName("is-remove-button")[0].addEventListener("click", removeRecordTypeFn);
            }
            tbodyEle.appendChild(trEle);
            var optionEle = document.createElement("option");
            optionEle.value = recordType.recordTypeKey;
            optionEle.innerText = recordType.recordType;
            recordTypesFilterEle.append(optionEle);
        }
        cityssm.clearElement(recordTypesContainerEle);
        recordTypesContainerEle.appendChild(tableEle);
    };
    crmAdmin.getRecordTypesFn = function (callbackFn) {
        crmAdmin.recordTypes = [];
        recordTypesFilterEle.innerHTML = "";
        cityssm.clearElement(recordTypesContainerEle);
        recordTypesContainerEle.innerHTML = crmAdmin.getLoadingHTML("Record Types");
        cityssm.postJSON(urlPrefix + "/admin/doGetRecordTypes", {}, function (responseJSON) {
            crmAdmin.recordTypes = responseJSON.recordTypes;
            renderRecordTypesFn();
            if (callbackFn) {
                callbackFn();
            }
        });
    };
    document.getElementById("is-add-record-type-button").addEventListener("click", function () {
        var formEle;
        var patternEle;
        var addRecordCloseModalFn;
        var isSubmitting = false;
        var submitFn = function (formEvent) {
            formEvent.preventDefault();
            if (isSubmitting) {
                return;
            }
            if (!crmAdmin.isValidRegex(patternEle.value)) {
                cityssm.alertModal("Regular Expression Pattern Invalid", "Please ensure you are using a valid regular expression.", "OK", "warning");
                return;
            }
            isSubmitting = true;
            cityssm.postJSON(urlPrefix + "/admin/doAddRecordType", formEle, function (responseJSON) {
                if (responseJSON.success) {
                    crmAdmin.recordTypes.unshift(responseJSON.recordType);
                    renderRecordTypesFn();
                    addRecordCloseModalFn();
                }
                else {
                    isSubmitting = false;
                    cityssm.alertModal("Error Adding Record Type", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                }
            });
        };
        cityssm.openHtmlModal("recordType-add", {
            onshow: function () {
                formEle = document.getElementById("form--addRecordType");
                patternEle = document.getElementById("addRecordType--pattern");
                patternEle.addEventListener("keyup", function () {
                    if (crmAdmin.isValidRegex(patternEle.value)) {
                        patternEle.classList.remove("is-danger");
                    }
                    else {
                        patternEle.classList.add("is-danger");
                    }
                });
                formEle.addEventListener("submit", submitFn);
            },
            onshown: function (_modalEle, closeModalFn) {
                addRecordCloseModalFn = closeModalFn;
            }
        });
    });
})();