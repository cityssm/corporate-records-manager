"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(function () {
    var urlPrefix = exports.urlPrefix;
    var crmEdit = exports.crmEdit;
    var comments = exports.recordComments;
    delete exports.recordComments;
    var commentPanelEle = document.getElementById("panel--comments");
    var openEditCommentModalFn = function (clickEvent) {
        clickEvent.preventDefault();
        var panelBlockEle = clickEvent.currentTarget.closest(".panel-block");
        var index = parseInt(panelBlockEle.getAttribute("data-index"), 10);
        var comment = comments[index];
        var closeEditModalFn;
        var editFn = function (formEvent) {
            formEvent.preventDefault();
            cityssm.postJSON(urlPrefix + "/edit/doUpdateComment", formEvent.currentTarget, function (responseJSON) {
                if (responseJSON.success) {
                    getComments();
                    closeEditModalFn();
                }
                else {
                    cityssm.alertModal("Update Comment Error", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                }
            });
        };
        cityssm.openHtmlModal("comment-edit", {
            onshow: function () {
                document.getElementById("editComment--commentLogID").value = comment.commentLogID.toString();
                var commentTime = new Date(comment.commentTime);
                document.getElementById("editComment--commentDateString").value = cityssm.dateToString(commentTime);
                document.getElementById("editComment--commentTimeString").value = cityssm.dateToTimeString(commentTime);
                document.getElementById("editComment--comment").value = comment.comment;
                document.getElementById("form--editComment").addEventListener("submit", editFn);
            },
            onshown: function (_modalEle, closeModalFn) {
                closeEditModalFn = closeModalFn;
            }
        });
    };
    var openRemoveCommentModalFn = function (clickEvent) {
        clickEvent.preventDefault();
        var panelBlockEle = clickEvent.currentTarget.closest(".panel-block");
        var index = parseInt(panelBlockEle.getAttribute("data-index"), 10);
        var comment = comments[index];
        var removeFn = function () {
            cityssm.postJSON(urlPrefix + "/edit/doRemoveComment", {
                commentLogID: comment.commentLogID
            }, function (responseJSON) {
                if (responseJSON.success) {
                    comments.splice(index, 1);
                    crmEdit.clearPanelBlocksFn(commentPanelEle);
                    renderCommentsFn();
                }
                else {
                    cityssm.alertModal("Remove Comment Error", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                }
            });
        };
        cityssm.confirmModal("Remove Comment", "Are you sure you want to remove this comment?", "Yes, Remove the Comment", "warning", removeFn);
    };
    var renderCommentFn = function (comment, index) {
        var panelBlockEle = document.createElement("div");
        panelBlockEle.className = "panel-block is-block";
        panelBlockEle.setAttribute("data-comment-log-id", comment.commentLogID.toString());
        panelBlockEle.setAttribute("data-index", index.toString());
        var commentTime = new Date(comment.commentTime);
        panelBlockEle.innerHTML = "<div class=\"columns\">" +
            ("<div class=\"column\">" +
                "<span class=\"has-tooltip-arrow has-tooltip-right\" data-tooltip=\"" + cityssm.dateToTimeString(commentTime) + "\">" + cityssm.dateToString(commentTime) + "</span><br />" +
                "<span class=\"is-size-7\">" + cityssm.escapeHTML(comment.comment) + "</span>" +
                "</div>") +
            ("<div class=\"column is-narrow\">" +
                "<button class=\"button is-info is-light is-small\" type=\"button\">" +
                "<span class=\"icon\"><i class=\"fas fa-pencil-alt\" aria-hidden=\"true\"></i></span>" +
                "<span>Edit</span>" +
                "</button>" +
                " <button class=\"button is-danger is-light is-small has-tooltip-arrow has-tooltip-left\" data-tooltip=\"Remove Comment\" type=\"button\">" +
                "<span class=\"icon\"><i class=\"fas fa-trash-alt\" aria-hidden=\"true\"></i></span>" +
                "</button>" +
                "</div>") +
            "</div>";
        var buttonEles = panelBlockEle.getElementsByTagName("button");
        buttonEles[0].addEventListener("click", openEditCommentModalFn);
        buttonEles[1].addEventListener("click", openRemoveCommentModalFn);
        commentPanelEle.appendChild(panelBlockEle);
    };
    var renderCommentsFn = function () {
        crmEdit.clearPanelBlocksFn(commentPanelEle);
        if (comments.length === 0) {
            commentPanelEle.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
                "<div class=\"message is-info\">" +
                "<div class=\"message-body\">This record has no comments.</div>" +
                "</div>" +
                "</div>");
            return;
        }
        comments.forEach(renderCommentFn);
    };
    var getComments = function () {
        crmEdit.clearPanelBlocksFn(commentPanelEle);
        comments = [];
        commentPanelEle.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block has-text-centered has-text-grey\">" +
            "<i class=\"fas fa-4x fa-spinner fa-pulse\" aria-hidden=\"true\"></i><br />" +
            "Loading Comments..." +
            "</div>");
        cityssm.postJSON(urlPrefix + "/view/doGetComments", {
            recordID: crmEdit.recordID
        }, function (responseJSON) {
            if (responseJSON.success) {
                comments = responseJSON.comments;
                renderCommentsFn();
            }
            else {
                commentPanelEle.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
                    "<div class=\"message is-danger\"><div class=\"message-body\">" +
                    responseJSON.message +
                    "</div></div>" +
                    "</div>");
            }
        });
    };
    renderCommentsFn();
    document.getElementById("is-add-comment-button").addEventListener("click", function () {
        var closeAddModalFn;
        var addFn = function (formEvent) {
            formEvent.preventDefault();
            cityssm.postJSON(urlPrefix + "/edit/doAddComment", formEvent.currentTarget, function (responseJSON) {
                if (responseJSON.success) {
                    getComments();
                    closeAddModalFn();
                }
                else {
                    cityssm.alertModal("Add Comment Error", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                }
            });
        };
        cityssm.openHtmlModal("comment-add", {
            onshow: function () {
                document.getElementById("addComment--recordID").value = crmEdit.recordID;
                var rightNow = new Date();
                document.getElementById("addComment--commentDateString").value = cityssm.dateToString(rightNow);
                document.getElementById("addComment--commentTimeString").value = cityssm.dateToTimeString(rightNow);
                document.getElementById("form--addComment").addEventListener("submit", addFn);
            },
            onshown: function (_modalEle, closeModalFn) {
                closeAddModalFn = closeModalFn;
            }
        });
    });
})();
