import type * as recordTypes from "../../types/recordTypes";

import type { CRMEdit } from "./main";

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
declare const cityssm: cityssmGlobal;


(() => {

  const urlPrefix: string = exports.urlPrefix;
  const crmEdit: CRMEdit = exports.crmEdit;

  let comments: recordTypes.RecordComment[] = exports.recordComments;
  delete exports.recordComments;

  const commentPanelEle = document.getElementById("panel--comments");

  const openEditCommentModalFn = (clickEvent: MouseEvent) => {

    clickEvent.preventDefault();

    const panelBlockEle = (clickEvent.currentTarget as HTMLElement).closest(".panel-block");

    const index = parseInt(panelBlockEle.getAttribute("data-index"), 10);
    const comment = comments[index];

    let closeEditModalFn: () => void;

    const editFn = (formEvent: Event) => {
      formEvent.preventDefault();

      cityssm.postJSON(urlPrefix + "/edit/doUpdateComment",
        formEvent.currentTarget,
        (responseJSON: { success: boolean; message?: string }) => {

          if (responseJSON.success) {
            getComments();
            closeEditModalFn();
          } else {
            cityssm.alertModal("Update Comment Error",
              cityssm.escapeHTML(responseJSON.message),
              "OK",
              "danger");
          }
        });
    };

    cityssm.openHtmlModal("comment-edit", {
      onshow: () => {

        (document.getElementById("editComment--commentLogID") as HTMLInputElement).value = comment.commentLogID.toString();

        const commentTime = new Date(comment.commentTime);
        (document.getElementById("editComment--commentDateString") as HTMLInputElement).value = cityssm.dateToString(commentTime);
        (document.getElementById("editComment--commentTimeString") as HTMLInputElement).value = cityssm.dateToTimeString(commentTime);

        (document.getElementById("editComment--comment") as HTMLTextAreaElement).value = comment.comment;

        document.getElementById("form--editComment").addEventListener("submit", editFn);
      },
      onshown: (_modalEle, closeModalFn) => {
        closeEditModalFn = closeModalFn;
      }
    });
  };

  const openRemoveCommentModalFn = (clickEvent: MouseEvent) => {

    clickEvent.preventDefault();

    const panelBlockEle = (clickEvent.currentTarget as HTMLElement).closest(".panel-block");

    const index = parseInt(panelBlockEle.getAttribute("data-index"), 10);
    const comment = comments[index];

    const removeFn = () => {

      cityssm.postJSON(urlPrefix + "/edit/doRemoveComment", {
        commentLogID: comment.commentLogID
      }, (responseJSON: { success: boolean; message?: string }) => {

        if (responseJSON.success) {
          comments.splice(index, 1);
          crmEdit.clearPanelBlocksFn(commentPanelEle);
          renderCommentsFn();

        } else {
          cityssm.alertModal("Remove Comment Error",
            cityssm.escapeHTML(responseJSON.message),
            "OK",
            "danger");
        }
      });
    };

    cityssm.confirmModal("Remove Comment",
      "Are you sure you want to remove this comment?",
      "Yes, Remove the Comment",
      "warning",
      removeFn);
  };

  const renderCommentFn = (comment: recordTypes.RecordComment, index: number) => {

    const panelBlockEle = document.createElement("div");
    panelBlockEle.className = "panel-block is-block";
    panelBlockEle.setAttribute("data-comment-log-id", comment.commentLogID.toString());
    panelBlockEle.setAttribute("data-index", index.toString());

    const commentTime = new Date(comment.commentTime);

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

    const buttonEles = panelBlockEle.getElementsByTagName("button");
    buttonEles[0].addEventListener("click", openEditCommentModalFn);
    buttonEles[1].addEventListener("click", openRemoveCommentModalFn);

    commentPanelEle.appendChild(panelBlockEle);
  };

  const renderCommentsFn = () => {

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

  const getComments = () => {

    crmEdit.clearPanelBlocksFn(commentPanelEle);
    comments = [];

    commentPanelEle.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block has-text-centered has-text-grey\">" +
      "<i class=\"fas fa-4x fa-spinner fa-pulse\" aria-hidden=\"true\"></i><br />" +
      "Loading Comments..." +
      "</div>");

    cityssm.postJSON(urlPrefix + "/view/doGetComments", {
      recordID: crmEdit.recordID
    },
      (responseJSON: { success: boolean; comments: recordTypes.RecordComment[]; message?: string }) => {

        if (responseJSON.success) {
          comments = responseJSON.comments;
          renderCommentsFn();
        } else {

          commentPanelEle.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
            "<div class=\"message is-danger\"><div class=\"message-body\">" +
            responseJSON.message +
            "</div></div>" +
            "</div>");
        }
      });
  };

  renderCommentsFn();

  document.getElementById("is-add-comment-button").addEventListener("click", () => {

    let closeAddModalFn: () => void;

    const addFn = (formEvent: Event) => {
      formEvent.preventDefault();

      cityssm.postJSON(urlPrefix + "/edit/doAddComment",
        formEvent.currentTarget,
        (responseJSON: { success: boolean; message?: string }) => {

          if (responseJSON.success) {
            getComments();
            closeAddModalFn();
          } else {
            cityssm.alertModal("Add Comment Error",
              cityssm.escapeHTML(responseJSON.message),
              "OK",
              "danger");
          }
        });
    };

    cityssm.openHtmlModal("comment-add", {
      onshow: () => {
        (document.getElementById("addComment--recordID") as HTMLInputElement).value = crmEdit.recordID;

        const rightNow = new Date();
        (document.getElementById("addComment--commentDateString") as HTMLInputElement).value = cityssm.dateToString(rightNow);
        (document.getElementById("addComment--commentTimeString") as HTMLInputElement).value = cityssm.dateToTimeString(rightNow);

        document.getElementById("form--addComment").addEventListener("submit", addFn);
      },
      onshown: (_modalEle, closeModalFn) => {
        closeAddModalFn = closeModalFn;
      }
    });
  });
})();
