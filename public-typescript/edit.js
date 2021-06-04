"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(function () {
    var urlPrefix = exports.urlPrefix;
    var recordID = document.getElementById("record--recordID").value;
    var clearPanelBlocksFn = function (panelEle) {
        var panelBlockEles = panelEle.getElementsByClassName("panel-block");
        for (var index = 0; index < panelBlockEles.length; index += 1) {
            panelBlockEles[index].remove();
            index -= 1;
        }
    };
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
                        clearPanelBlocksFn(statusPanelEle);
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
            clearPanelBlocksFn(statusPanelEle);
            clearPanelBlocksFn(statusPanelEle);
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
            clearPanelBlocksFn(statusPanelEle);
            statuses_1 = [];
            statusPanelEle.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block has-text-centered has-text-grey\">" +
                "<i class=\"fas fa-4x fa-spinner fa-pulse\" aria-hidden=\"true\"></i><br />" +
                "Loading Statuses..." +
                "</div>");
            cityssm.postJSON(urlPrefix + "/view/doGetStatuses", {
                recordID: recordID
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
                        document.getElementById("addStatus--recordID").value = recordID;
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
                        document.getElementById("form--addStatus").addEventListener("submit", addFn);
                    },
                    onshown: function (_modalEle, closeModalFn) {
                        closeAddModalFn = closeModalFn;
                    }
                });
            });
        }
    }
    {
        var urls_1 = exports.recordURLs;
        delete exports.recordURLs;
        var urlPanelEle_1 = document.getElementById("panel--urls");
        var openEditURLModalFn_1 = function (clickEvent) {
            clickEvent.preventDefault();
            var panelBlockEle = clickEvent.currentTarget.closest(".panel-block");
            var index = parseInt(panelBlockEle.getAttribute("data-index"), 10);
            var url = urls_1[index];
            var closeEditModalFn;
            var editFn = function (formEvent) {
                formEvent.preventDefault();
                cityssm.postJSON(urlPrefix + "/edit/doUpdateURL", formEvent.currentTarget, function (responseJSON) {
                    if (responseJSON.success) {
                        getURLs_1();
                        closeEditModalFn();
                    }
                    else {
                        cityssm.alertModal("Update Link Error", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                    }
                });
            };
            cityssm.openHtmlModal("url-edit", {
                onshow: function () {
                    document.getElementById("editURL--urlID").value = url.urlID.toString();
                    document.getElementById("editURL--url").value = url.url;
                    document.getElementById("editURL--urlTitle").value = url.urlTitle;
                    document.getElementById("editURL--urlDescription").value = url.urlDescription;
                    document.getElementById("form--editURL").addEventListener("submit", editFn);
                },
                onshown: function (_modalEle, closeModalFn) {
                    closeEditModalFn = closeModalFn;
                }
            });
        };
        var openRemoveURLModalFn_1 = function (clickEvent) {
            clickEvent.preventDefault();
            var panelBlockEle = clickEvent.currentTarget.closest(".panel-block");
            var index = parseInt(panelBlockEle.getAttribute("data-index"), 10);
            var url = urls_1[index];
            var removeFn = function () {
                cityssm.postJSON(urlPrefix + "/edit/doRemoveURL", {
                    urlID: url.urlID
                }, function (responseJSON) {
                    if (responseJSON.success) {
                        urls_1.splice(index, 1);
                        clearPanelBlocksFn(urlPanelEle_1);
                        renderURLsFn_1();
                    }
                    else {
                        cityssm.alertModal("Remove Link Error", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                    }
                });
            };
            cityssm.confirmModal("Remove Link", "Are you sure you want to remove the link to \"" + cityssm.escapeHTML(url.urlTitle) + "\"?", "Yes, Remove the Link", "warning", removeFn);
        };
        var renderURLFn_1 = function (url, index) {
            var panelBlockEle = document.createElement("div");
            panelBlockEle.className = "panel-block is-block";
            panelBlockEle.setAttribute("data-url-id", url.urlID.toString());
            panelBlockEle.setAttribute("data-index", index.toString());
            panelBlockEle.innerHTML = "<div class=\"columns\">" +
                ("<div class=\"column\">" +
                    "<a class=\"has-text-weight-bold\" href=\"" + cityssm.escapeHTML(url.url) + "\" target=\"_blank\">" +
                    cityssm.escapeHTML(url.urlTitle) +
                    "</a><br />" +
                    "<span class=\"tag has-tooltip-arrow has-tooltip-right\" data-tooltip=\"Link Domain\">" + url.url.split("/")[2] + "</span><br />" +
                    "<span class=\"is-size-7\">" + cityssm.escapeHTML(url.urlDescription) + "</span>" +
                    "</div>") +
                ("<div class=\"column is-narrow\">" +
                    "<button class=\"button is-info is-light is-small\" type=\"button\">" +
                    "<span class=\"icon\"><i class=\"fas fa-pencil-alt\" aria-hidden=\"true\"></i></span>" +
                    "<span>Edit</span>" +
                    "</button>" +
                    " <button class=\"button is-danger is-light is-small has-tooltip-arrow has-tooltip-left\" data-tooltip=\"Remove Link\" type=\"button\">" +
                    "<span class=\"icon\"><i class=\"fas fa-trash-alt\" aria-hidden=\"true\"></i></span>" +
                    "</button>" +
                    "</div>") +
                "</div>";
            var buttonEles = panelBlockEle.getElementsByTagName("button");
            buttonEles[0].addEventListener("click", openEditURLModalFn_1);
            buttonEles[1].addEventListener("click", openRemoveURLModalFn_1);
            urlPanelEle_1.appendChild(panelBlockEle);
        };
        var renderURLsFn_1 = function () {
            clearPanelBlocksFn(urlPanelEle_1);
            if (urls_1.length === 0) {
                urlPanelEle_1.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
                    "<div class=\"message is-info\">" +
                    "<div class=\"message-body\">There are no links associated with this record.</div>" +
                    "</div>" +
                    "</div>");
                return;
            }
            urls_1.forEach(renderURLFn_1);
        };
        var getURLs_1 = function () {
            clearPanelBlocksFn(urlPanelEle_1);
            urls_1 = [];
            urlPanelEle_1.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block has-text-centered has-text-grey\">" +
                "<i class=\"fas fa-4x fa-spinner fa-pulse\" aria-hidden=\"true\"></i><br />" +
                "Loading Links..." +
                "</div>");
            cityssm.postJSON(urlPrefix + "/view/doGetURLs", {
                recordID: recordID
            }, function (responseJSON) {
                if (responseJSON.success) {
                    urls_1 = responseJSON.urls;
                    renderURLsFn_1();
                }
                else {
                    urlPanelEle_1.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
                        "<div class=\"message is-danger\"><div class=\"message-body\">" +
                        responseJSON.message +
                        "</div></div>" +
                        "</div>");
                }
            });
        };
        renderURLsFn_1();
        document.getElementById("is-add-url-button").addEventListener("click", function () {
            var closeAddModalFn;
            var addFn = function (formEvent) {
                formEvent.preventDefault();
                cityssm.postJSON(urlPrefix + "/edit/doAddURL", formEvent.currentTarget, function (responseJSON) {
                    if (responseJSON.success) {
                        getURLs_1();
                        closeAddModalFn();
                    }
                    else {
                        cityssm.alertModal("Add Link Error", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                    }
                });
            };
            cityssm.openHtmlModal("url-add", {
                onshow: function () {
                    document.getElementById("addURL--recordID").value = recordID;
                    document.getElementById("form--addURL").addEventListener("submit", addFn);
                },
                onshown: function (_modalEle, closeModalFn) {
                    closeAddModalFn = closeModalFn;
                }
            });
        });
        var addDocuShareButtonEle = document.getElementById("is-add-docushare-url-button");
        if (addDocuShareButtonEle) {
            addDocuShareButtonEle.addEventListener("click", function () {
                var doRefreshOnClose = false;
                var searchFormEle;
                var searchResultsContainerEle;
                var addFn = function (event) {
                    event.preventDefault();
                    var buttonEle = event.currentTarget;
                    buttonEle.disabled = true;
                    var panelBlockEle = buttonEle.closest(".panel-block");
                    var handle = panelBlockEle.getAttribute("data-handle");
                    cityssm.postJSON(urlPrefix + "/edit/doAddDocuShareURL", {
                        recordID: recordID,
                        handle: handle
                    }, function (responseJSON) {
                        if (responseJSON.success) {
                            doRefreshOnClose = true;
                            panelBlockEle.remove();
                        }
                        else {
                            cityssm.alertModal("Error Adding Link", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                            buttonEle.disabled = false;
                        }
                    });
                };
                var searchDocuShareFn = function (event) {
                    if (event) {
                        event.preventDefault();
                    }
                    searchResultsContainerEle.innerHTML = "<div class=\"has-text-centered has-text-grey\">" +
                        "<i class=\"fas fa-4x fa-spinner fa-pulse\" aria-hidden=\"true\"></i><br />" +
                        "Searching DocuShare..." +
                        "</div>";
                    cityssm.postJSON(urlPrefix + "/edit/doSearchDocuShare", searchFormEle, function (responseJSON) {
                        if (!responseJSON.success) {
                            searchResultsContainerEle.innerHTML = "<div class=\"message is-danger\">" +
                                "<div class=\"message-body\">" +
                                "<p>An error occurred retrieving documents from DocuShare.</p>" +
                                "<p>" + cityssm.escapeHTML(responseJSON.message) + "</p>" +
                                "</div>" +
                                "</div>";
                            return;
                        }
                        var panelEle = document.createElement("div");
                        panelEle.className = "panel";
                        for (var _i = 0, _a = responseJSON.dsObjects; _i < _a.length; _i++) {
                            var dsObject = _a[_i];
                            if (urlPanelEle_1.querySelector("a[href='" + dsObject.url + "']")) {
                                continue;
                            }
                            var panelBlockEle = document.createElement("div");
                            panelBlockEle.className = "panel-block is-block";
                            panelBlockEle.setAttribute("data-handle", dsObject.handle);
                            panelBlockEle.innerHTML = "<div class=\"level\">" +
                                ("<div class=\"level-left\">" +
                                    "<strong>" + cityssm.escapeHTML(dsObject.title) + "</strong>" +
                                    "</div>") +
                                ("<div class=\"level-right\">" +
                                    "<a class=\"button is-info mr-1\" href=\"" + dsObject.url + "\" target=\"_blank\">" +
                                    "<span class=\"icon\"><i class=\"fas fa-eye\" aria-hidden=\"true\"></i></span>" +
                                    "<span>View</span>" +
                                    "</a>" +
                                    "<button class=\"button is-success\" type=\"button\">" +
                                    "<span class=\"icon\"><i class=\"fas fa-plus\" aria-hidden=\"true\"></i></span>" +
                                    "<span>Add Link</span>" +
                                    "</button>" +
                                    "</div>") +
                                "</div>";
                            panelBlockEle.getElementsByTagName("button")[0].addEventListener("click", addFn);
                            panelEle.appendChild(panelBlockEle);
                        }
                        searchResultsContainerEle.innerHTML = "";
                        if (panelEle.children.length === 0) {
                            searchResultsContainerEle.innerHTML = "<div class=\"message is-info\">" +
                                "<div class=\"message-body\">" +
                                "<p>There are no new files in DocuShare that meet your search criteria.</p>" +
                                "</div>" +
                                "</div>";
                        }
                        else {
                            searchResultsContainerEle.appendChild(panelEle);
                        }
                    });
                };
                cityssm.openHtmlModal("docushare-url-add", {
                    onshow: function () {
                        searchResultsContainerEle = document.getElementById("container--addDocuShareURL");
                        searchFormEle = document.getElementById("form--addDocuShareURL-search");
                        searchFormEle.addEventListener("submit", searchDocuShareFn);
                        var collectionSelectEle = document.getElementById("addDocuShareURL--collectionHandleIndex");
                        for (var index = 0; index < exports.docuShareCollectionHandles.length; index += 1) {
                            var optionEle = document.createElement("option");
                            optionEle.value = index.toString();
                            optionEle.innerText = exports.docuShareCollectionHandles[index].title;
                            collectionSelectEle.appendChild(optionEle);
                            if (index === 0) {
                                collectionSelectEle.value = index.toString();
                            }
                        }
                        collectionSelectEle.addEventListener("change", searchDocuShareFn);
                        var searchStringEle = document.getElementById("addDocuShareURL--searchString");
                        searchStringEle.value = document.getElementById("record--recordNumber").value;
                        searchDocuShareFn();
                    },
                    onhidden: function () {
                        if (doRefreshOnClose) {
                            getURLs_1();
                        }
                    }
                });
            });
        }
    }
    {
        var relatedRecordPanelEle = document.getElementById("panel--relatedRecords");
    }
    {
        var commentPanelEle_1 = document.getElementById("panel--comments");
        var renderCommentsFn = function (comments) {
            clearPanelBlocksFn(commentPanelEle_1);
        };
        renderCommentsFn(exports.recordComments);
        delete exports.recordComments;
    }
})();
