"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(function () {
    var urlPrefix = exports.urlPrefix;
    var recordID = document.getElementById("record--recordID").value;
    var recordTypeKeyEle = document.getElementById("record--recordTypeKey");
    var recordTypeKey = recordTypeKeyEle.value;
    var recordType = recordTypeKeyEle.getAttribute("data-record-type");
    var clearPanelBlocksFn = function (panelEle) {
        var panelBlockEles = panelEle.getElementsByClassName("panel-block");
        for (var index = 0; index < panelBlockEles.length; index += 1) {
            panelBlockEles[index].remove();
        }
    };
    {
        var statusPanelEle_1 = document.getElementById("panel--statuses");
        var renderStatusesFn = function (statuses) {
            clearPanelBlocksFn(statusPanelEle_1);
        };
        renderStatusesFn(exports.recordStatuses);
        delete exports.recordStatuses;
    }
    {
        var urlPanelEle_1 = document.getElementById("panel--urls");
        var renderURLsFn = function (urls) {
            clearPanelBlocksFn(urlPanelEle_1);
            if (urls.length === 0) {
                urlPanelEle_1.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
                    "<div class=\"message is-info\">" +
                    "<div class=\"message-body\">There are no links associated with this record.</div>" +
                    "</div>" +
                    "</div>");
                return;
            }
            for (var _i = 0, urls_1 = urls; _i < urls_1.length; _i++) {
                var url = urls_1[_i];
                var panelBlockEle = document.createElement("div");
                panelBlockEle.className = "panel-block is-block";
                panelBlockEle.setAttribute("data-url-id", url.urlID.toString());
                panelBlockEle.innerHTML =
                    "<a class=\"has-text-weight-bold\" href=\"" + cityssm.escapeHTML(url.url) + "\" target=\"_blank\">" +
                        cityssm.escapeHTML(url.urlTitle) +
                        "</a><br />" +
                        "<span class=\"tag\">" + url.url.split("/")[2] + "</span>" +
                        cityssm.escapeHTML(url.urlDescription);
                urlPanelEle_1.appendChild(panelBlockEle);
            }
        };
        var getURLs_1 = function () {
        };
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
                    alert(handle);
                    cityssm.postJSON(urlPrefix + "/edit/doAddDocuShareLink", {
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
                                    "<a class=\"button is-info\" href=\"" + dsObject.url + "\" target=\"_blank\">" +
                                    "View Document" +
                                    "</a>" +
                                    " <button class=\"button is-success\" type=\"button\">" +
                                    "Add Link" +
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
        renderURLsFn(exports.recordURLs);
        delete exports.recordURLs;
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
