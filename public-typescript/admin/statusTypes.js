"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(function () {
    var crmAdmin = exports.crmAdmin;
    var urlPrefix = exports.urlPrefix;
    var statusTypesContainerEle = document.getElementById("container--statusTypes");
    var recordTypesFilterEle = document.getElementById("statusTypesFilter--recordTypeKey");
    var statusTypes = [];
    var getStatusTypeFromEventFn = function (clickEvent) {
        var buttonEle = clickEvent.currentTarget;
        var trEle = buttonEle.closest("tr");
        var statusTypeIndex = parseInt(trEle.getAttribute("data-index"), 10);
        var statusType = statusTypes[statusTypeIndex];
        return {
            buttonEle: buttonEle,
            trEle: trEle,
            statusTypeIndex: statusTypeIndex,
            statusType: statusType
        };
    };
    var toggleStatusTypeActiveFn = function (clickEvent) {
        var _a = getStatusTypeFromEventFn(clickEvent), buttonEle = _a.buttonEle, statusType = _a.statusType;
        buttonEle.disabled = true;
        var newIsActive = !statusType.isActive;
        cityssm.postJSON(urlPrefix + "/admin/doSetStatusTypeIsActive", {
            statusTypeKey: statusType.statusTypeKey,
            isActive: newIsActive
        }, function (responseJSON) {
            buttonEle.disabled = false;
            if (responseJSON.success) {
                statusType.isActive = newIsActive;
                if (newIsActive) {
                    buttonEle.innerHTML = "<i class=\"fas fa-check\" aria-label=\"Active Status Type\"></i>";
                }
                else {
                    buttonEle.innerHTML = "<i class=\"fas fa-minus\" aria-label=\"False\"></i>";
                }
            }
            else {
                cityssm.alertModal("Status Type Not Updated", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
            }
        });
    };
    var setStatusTypeOrderNumberFn = function (statusTypeKey, newOrderNumber) {
        cityssm.postJSON(urlPrefix + "/admin/doSetStatusTypeOrderNumber", {
            statusTypeKey: statusTypeKey,
            orderNumber: newOrderNumber
        }, function (responseJSON) {
            if (responseJSON.success) {
                statusTypes = responseJSON.statusTypes;
                renderStatusTypesFn();
            }
            else {
                cityssm.alertModal("Error Moving Status Type", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
            }
        });
    };
    var moveStatusTypeUpFn = function (clickEvent) {
        var _a = getStatusTypeFromEventFn(clickEvent), buttonEle = _a.buttonEle, statusType = _a.statusType;
        buttonEle.disabled = true;
        setStatusTypeOrderNumberFn(statusType.statusTypeKey, statusType.orderNumber - 1);
    };
    var moveStatusTypeDownFn = function (clickEvent) {
        var _a = getStatusTypeFromEventFn(clickEvent), buttonEle = _a.buttonEle, statusType = _a.statusType;
        buttonEle.disabled = true;
        setStatusTypeOrderNumberFn(statusType.statusTypeKey, statusType.orderNumber + 1);
    };
    var updateStatusTypeFn = function (clickEvent) {
        var statusType = getStatusTypeFromEventFn(clickEvent).statusType;
        var formEle;
        var updateStatusTypeCloseModalFn;
        var submitFn = function (formEvent) {
            formEvent.preventDefault();
            cityssm.postJSON(urlPrefix + "/admin/doUpdateStatusType", formEle, function (responseJSON) {
                if (responseJSON.success) {
                    updateStatusTypeCloseModalFn();
                    statusTypes = responseJSON.statusTypes;
                    renderStatusTypesFn();
                }
                else {
                    cityssm.alertModal("Error Updating Status Type", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                }
            });
        };
        cityssm.openHtmlModal("statusType-edit", {
            onshow: function () {
                document.getElementById("editStatusType--statusTypeKey").value = statusType.statusTypeKey;
                document.getElementById("editStatusType--statusType").value = statusType.statusType;
                formEle = document.getElementById("form--editStatusType");
                formEle.addEventListener("submit", submitFn);
            },
            onshown: function (_modalEle, closeModalFn) {
                updateStatusTypeCloseModalFn = closeModalFn;
            }
        });
    };
    var removeStatusTypeFn = function (clickEvent) {
        var statusType = getStatusTypeFromEventFn(clickEvent).statusType;
        var removeFn = function () {
            cityssm.postJSON(urlPrefix + "/admin/doRemoveStatusType", {
                statusTypeKey: statusType.statusTypeKey
            }, function (responseJSON) {
                if (responseJSON.success) {
                    statusTypes = responseJSON.statusTypes;
                    renderStatusTypesFn();
                }
                else {
                    cityssm.alertModal("Error Removing Status Type", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                }
            });
        };
        cityssm.confirmModal("Remove Status Type", "Are you sure you want to remove the \"" + cityssm.escapeHTML(statusType.statusType) + "\" status type?", "Yes, Remove It", "warning", removeFn);
    };
    var renderStatusTypesFn = function () {
        var recordTypeKey = recordTypesFilterEle.value;
        var hasStatusTypes = false;
        var tableEle = document.createElement("table");
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
        var tbodyEle = tableEle.getElementsByTagName("tbody")[0];
        for (var index = 0; index < statusTypes.length; index += 1) {
            var statusType = statusTypes[index];
            if (recordTypeKey !== statusType.recordTypeKey) {
                continue;
            }
            var trEle = document.createElement("tr");
            trEle.setAttribute("data-index", index.toString());
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
            trEle.getElementsByClassName("is-toggle-active-button")[0].addEventListener("click", toggleStatusTypeActiveFn);
            trEle.getElementsByClassName("is-up-button")[0].addEventListener("click", moveStatusTypeUpFn);
            trEle.getElementsByClassName("is-down-button")[0].addEventListener("click", moveStatusTypeDownFn);
            trEle.getElementsByClassName("is-update-button")[0].addEventListener("click", updateStatusTypeFn);
            if (statusType.recordCount === 0) {
                trEle.getElementsByClassName("is-remove-button")[0].addEventListener("click", removeStatusTypeFn);
            }
            tbodyEle.appendChild(trEle);
            hasStatusTypes = true;
        }
        cityssm.clearElement(statusTypesContainerEle);
        if (hasStatusTypes) {
            var trEles = tbodyEle.getElementsByTagName("tr");
            trEles[0].getElementsByClassName("is-up-button")[0].disabled = true;
            trEles[trEles.length - 1].getElementsByClassName("is-down-button")[0].disabled = true;
            statusTypesContainerEle.appendChild(tableEle);
        }
        else {
            statusTypesContainerEle.innerHTML = "<div class=\"message is-info\">" +
                "<p class=\"message-body\">There are no status types associated with the selected record type.</p>" +
                "</div>";
        }
    };
    crmAdmin.getStatusTypesFn = function () {
        statusTypes = [];
        cityssm.clearElement(statusTypesContainerEle);
        statusTypesContainerEle.innerHTML = crmAdmin.getLoadingHTML("Status Types");
        cityssm.postJSON(urlPrefix + "/admin/doGetStatusTypes", {}, function (responseJSON) {
            statusTypes = responseJSON.statusTypes;
            renderStatusTypesFn();
        });
    };
    recordTypesFilterEle.addEventListener("change", renderStatusTypesFn);
    document.getElementById("is-add-status-type-button").addEventListener("click", function () {
        var addStatusTypeCloseModalFn;
        var formEle;
        var submitFn = function (formEvent) {
            formEvent.preventDefault();
            cityssm.postJSON(urlPrefix + "/admin/doAddStatusType", formEle, function (responseJSON) {
                if (responseJSON.success) {
                    addStatusTypeCloseModalFn();
                    statusTypes = responseJSON.statusTypes;
                    renderStatusTypesFn();
                }
                else {
                    cityssm.alertModal("Error Adding Status Type", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                }
            });
        };
        cityssm.openHtmlModal("statusType-add", {
            onshow: function () {
                var recordType = crmAdmin.recordTypes.find(function (currentRecordType) {
                    return currentRecordType.recordTypeKey === recordTypesFilterEle.value;
                });
                document.getElementById("addStatusType--recordType").innerText = recordType.recordType;
                document.getElementById("addStatusType--recordTypeKey").value = recordTypesFilterEle.value;
                formEle = document.getElementById("form--addStatusType");
                formEle.addEventListener("submit", submitFn);
            },
            onshown: function (_modalEle, closeModalFn) {
                addStatusTypeCloseModalFn = closeModalFn;
            }
        });
    });
})();
