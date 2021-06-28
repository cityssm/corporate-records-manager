"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(function () {
    var urlPrefix = exports.urlPrefix;
    var crmEdit = exports.crmEdit;
    var urls = exports.recordURLs;
    delete exports.recordURLs;
    var urlPanelEle = document.getElementById("panel--urls");
    var openEditURLModalFn = function (clickEvent) {
        clickEvent.preventDefault();
        var panelBlockEle = clickEvent.currentTarget.closest(".panel-block");
        var index = parseInt(panelBlockEle.getAttribute("data-index"), 10);
        var url = urls[index];
        var closeEditModalFn;
        var editFn = function (formEvent) {
            formEvent.preventDefault();
            cityssm.postJSON(urlPrefix + "/edit/doUpdateURL", formEvent.currentTarget, function (responseJSON) {
                if (responseJSON.success) {
                    getURLs();
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
    var openRemoveURLModalFn = function (clickEvent) {
        clickEvent.preventDefault();
        var panelBlockEle = clickEvent.currentTarget.closest(".panel-block");
        var index = parseInt(panelBlockEle.getAttribute("data-index"), 10);
        var url = urls[index];
        var removeFn = function () {
            cityssm.postJSON(urlPrefix + "/edit/doRemoveURL", {
                urlID: url.urlID
            }, function (responseJSON) {
                if (responseJSON.success) {
                    urls.splice(index, 1);
                    crmEdit.clearPanelBlocksFn(urlPanelEle);
                    renderURLsFn();
                }
                else {
                    cityssm.alertModal("Remove Link Error", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                }
            });
        };
        cityssm.confirmModal("Remove Link", "Are you sure you want to remove the link to \"" + cityssm.escapeHTML(url.urlTitle) + "\"?", "Yes, Remove the Link", "warning", removeFn);
    };
    var renderURLFn = function (url, index) {
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
        buttonEles[0].addEventListener("click", openEditURLModalFn);
        buttonEles[1].addEventListener("click", openRemoveURLModalFn);
        urlPanelEle.appendChild(panelBlockEle);
    };
    var renderURLsFn = function () {
        crmEdit.clearPanelBlocksFn(urlPanelEle);
        if (urls.length === 0) {
            urlPanelEle.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
                "<div class=\"message is-info\">" +
                "<div class=\"message-body\">There are no links associated with this record.</div>" +
                "</div>" +
                "</div>");
            return;
        }
        urls.forEach(renderURLFn);
    };
    var getURLs = function () {
        crmEdit.clearPanelBlocksFn(urlPanelEle);
        urls = [];
        urlPanelEle.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block has-text-centered has-text-grey\">" +
            "<i class=\"fas fa-4x fa-spinner fa-pulse\" aria-hidden=\"true\"></i><br />" +
            "Loading Links..." +
            "</div>");
        cityssm.postJSON(urlPrefix + "/view/doGetURLs", {
            recordID: crmEdit.recordID
        }, function (responseJSON) {
            if (responseJSON.success) {
                urls = responseJSON.urls;
                renderURLsFn();
            }
            else {
                urlPanelEle.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
                    "<div class=\"message is-danger\"><div class=\"message-body\">" +
                    responseJSON.message +
                    "</div></div>" +
                    "</div>");
            }
        });
    };
    renderURLsFn();
    document.getElementById("is-add-url-button").addEventListener("click", function () {
        var closeAddModalFn;
        var addFn = function (formEvent) {
            formEvent.preventDefault();
            cityssm.postJSON(urlPrefix + "/edit/doAddURL", formEvent.currentTarget, function (responseJSON) {
                if (responseJSON.success) {
                    getURLs();
                    closeAddModalFn();
                }
                else {
                    cityssm.alertModal("Add Link Error", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                }
            });
        };
        cityssm.openHtmlModal("url-add", {
            onshow: function () {
                document.getElementById("addURL--recordID").value = crmEdit.recordID;
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
                    recordID: crmEdit.recordID,
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
                        if (urlPanelEle.querySelector("a[href='" + dsObject.url + "']")) {
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
                        getURLs();
                    }
                }
            });
        });
    }
})();
