"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(function () {
    var urlPrefix = exports.urlPrefix;
    var crmEdit = exports.crmEdit;
    var statusPanelEle = document.getElementById("panel--statuses");
    if (statusPanelEle) {
        var statuses_1 = exports.recordStatuses;
        delete exports.recordStatuses;
        var openEditStatusModalFn_1 = function (clickEvent) {
            clickEvent.preventDefault();
            var panelBlockEle = clickEvent.currentTarget.closest(".panel-block");
            var index = parseInt(panelBlockEle.getAttribute("data-index"), 10);
            var status = statuses_1[index];
            var closeEditModalFn;
            var editFn = function (formEvent) {
                formEvent.preventDefault();
                cityssm.postJSON(urlPrefix + "/edit/doUpdateStatus", formEvent.currentTarget, function (responseJSON) {
                    if (responseJSON.success) {
                        getStatuses_1();
                        closeEditModalFn();
                    }
                    else {
                        cityssm.alertModal("Update Status Error", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                    }
                });
            };
            cityssm.openHtmlModal("status-edit", {
                onshow: function () {
                    document.getElementById("editStatus--statusLogID").value = status.statusLogID.toString();
                    var statusTypeKeyEle = document.getElementById("editStatus--statusTypeKey");
                    var statusTypes = exports.statusTypes;
                    var statusTypeKeyFound = false;
                    for (var _i = 0, statusTypes_1 = statusTypes; _i < statusTypes_1.length; _i++) {
                        var statusType = statusTypes_1[_i];
                        if (statusType.isActive || statusType.statusTypeKey === status.statusTypeKey) {
                            statusTypeKeyEle.insertAdjacentHTML("beforeend", "<option value=\"" + cityssm.escapeHTML(statusType.statusTypeKey) + "\">" +
                                cityssm.escapeHTML(statusType.statusType) +
                                "</option>");
                            if (statusType.statusTypeKey === status.statusTypeKey) {
                                statusTypeKeyFound = true;
                            }
                        }
                    }
                    if (!statusTypeKeyFound) {
                        statusTypeKeyEle.insertAdjacentHTML("beforeend", "<option value=\"" + cityssm.escapeHTML(status.statusTypeKey) + "\">" +
                            cityssm.escapeHTML(status.statusTypeKey) +
                            "</option>");
                    }
                    statusTypeKeyEle.value = status.statusTypeKey;
                    var statusTime = new Date(status.statusTime);
                    document.getElementById("editStatus--statusDateString").value = cityssm.dateToString(statusTime);
                    document.getElementById("editStatus--statusTimeString").value = cityssm.dateToTimeString(statusTime);
                    document.getElementById("editStatus--statusLog").value = status.statusLog;
                    document.getElementById("form--editStatus").addEventListener("submit", editFn);
                },
                onshown: function (_modalEle, closeModalFn) {
                    closeEditModalFn = closeModalFn;
                }
            });
        };
        var openRemoveStatusModalFn_1 = function (clickEvent) {
            clickEvent.preventDefault();
            var panelBlockEle = clickEvent.currentTarget.closest(".panel-block");
            var index = parseInt(panelBlockEle.getAttribute("data-index"), 10);
            var status = statuses_1[index];
            var removeFn = function () {
                cityssm.postJSON(urlPrefix + "/edit/doRemoveStatus", {
                    statusLogID: status.statusLogID
                }, function (responseJSON) {
                    if (responseJSON.success) {
                        statuses_1.splice(index, 1);
                        crmEdit.clearPanelBlocksFn(statusPanelEle);
                        renderStatusesFn_1();
                    }
                    else {
                        cityssm.alertModal("Remove Status Error", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                    }
                });
            };
            cityssm.confirmModal("Remove Status", "Are you sure you want to remove this status?<br />" +
                "If the status of this record has changed, it would be better to add a new status.", "Yes, Remove the Status", "warning", removeFn);
        };
        var renderStatusFn_1 = function (status, index) {
            var panelBlockEle = document.createElement("div");
            panelBlockEle.className = "panel-block is-block";
            panelBlockEle.setAttribute("data-status-log-id", status.statusLogID.toString());
            panelBlockEle.setAttribute("data-index", index.toString());
            var statusType = exports.statusTypes.find(function (possibleStatusType) {
                return possibleStatusType.statusTypeKey === status.statusTypeKey;
            });
            var statusTime = new Date(status.statusTime);
            panelBlockEle.innerHTML = "<div class=\"columns\">" +
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
                    " <button class=\"button is-danger is-light is-small has-tooltip-arrow has-tooltip-left\" data-tooltip=\"Remove Status\" type=\"button\">" +
                    "<span class=\"icon\"><i class=\"fas fa-trash-alt\" aria-hidden=\"true\"></i></span>" +
                    "</button>" +
                    "</div>") +
                "</div>";
            var buttonEles = panelBlockEle.getElementsByTagName("button");
            buttonEles[0].addEventListener("click", openEditStatusModalFn_1);
            buttonEles[1].addEventListener("click", openRemoveStatusModalFn_1);
            statusPanelEle.appendChild(panelBlockEle);
        };
        var renderStatusesFn_1 = function () {
            crmEdit.clearPanelBlocksFn(statusPanelEle);
            if (statuses_1.length === 0) {
                statusPanelEle.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
                    "<div class=\"message is-warning\">" +
                    "<div class=\"message-body\">There are no statuses associated with this record.</div>" +
                    "</div>" +
                    "</div>");
                return;
            }
            statuses_1.forEach(renderStatusFn_1);
        };
        var getStatuses_1 = function () {
            crmEdit.clearPanelBlocksFn(statusPanelEle);
            statuses_1 = [];
            statusPanelEle.insertAdjacentHTML("beforeend", crmEdit.getLoadingPanelBlockHTML("Statuses"));
            cityssm.postJSON(urlPrefix + "/view/doGetStatuses", {
                recordID: crmEdit.recordID
            }, function (responseJSON) {
                if (responseJSON.success) {
                    statuses_1 = responseJSON.statuses;
                    renderStatusesFn_1();
                }
                else {
                    statusPanelEle.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
                        "<div class=\"message is-danger\"><div class=\"message-body\">" +
                        responseJSON.message +
                        "</div></div>" +
                        "</div>");
                }
            });
        };
        renderStatusesFn_1();
        var addStatusButtonEle = document.getElementById("is-add-status-button");
        if (addStatusButtonEle) {
            addStatusButtonEle.addEventListener("click", function () {
                var closeAddModalFn;
                var addFn = function (formEvent) {
                    formEvent.preventDefault();
                    cityssm.postJSON(urlPrefix + "/edit/doAddStatus", formEvent.currentTarget, function (responseJSON) {
                        if (responseJSON.success) {
                            getStatuses_1();
                            closeAddModalFn();
                        }
                        else {
                            cityssm.alertModal("Add Status Error", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                        }
                    });
                };
                cityssm.openHtmlModal("status-add", {
                    onshow: function () {
                        document.getElementById("addStatus--recordID").value = crmEdit.recordID;
                        var statusTypeKeyEle = document.getElementById("addStatus--statusTypeKey");
                        var statusTypes = exports.statusTypes;
                        for (var _i = 0, statusTypes_2 = statusTypes; _i < statusTypes_2.length; _i++) {
                            var statusType = statusTypes_2[_i];
                            if (statusType.isActive) {
                                statusTypeKeyEle.insertAdjacentHTML("beforeend", "<option value=\"" + cityssm.escapeHTML(statusType.statusTypeKey) + "\">" +
                                    cityssm.escapeHTML(statusType.statusType) +
                                    "</option>");
                            }
                        }
                        var rightNow = new Date();
                        document.getElementById("addStatus--statusDateString").value = cityssm.dateToString(rightNow);
                        document.getElementById("addStatus--statusTimeString").value = cityssm.dateToTimeString(rightNow);
                    },
                    onshown: function (_modalEle, closeModalFn) {
                        closeAddModalFn = closeModalFn;
                        document.getElementById("form--addStatus").addEventListener("submit", addFn);
                    }
                });
            });
        }
    }
})();
