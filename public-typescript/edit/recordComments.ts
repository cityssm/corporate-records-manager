/* eslint-disable unicorn/prefer-module */

import type * as recordTypes from "../../types/recordTypes";

import type { CRMEdit } from "./main";

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
declare const cityssm: cityssmGlobal;


(() => {

  const urlPrefix: string = exports.urlPrefix;
  const crmEdit: CRMEdit = exports.crmEdit;

  let comments: recordTypes.RecordComment[] = exports.recordComments;
  delete exports.recordComments;

  const commentPanelEle = document.querySelector("#panel--comments") as HTMLElement;

  const openEditCommentModalFunction = (clickEvent: MouseEvent) => {

    clickEvent.preventDefault();

    const panelBlockEle = (clickEvent.currentTarget as HTMLElement).closest(".panel-block") as HTMLElement;

    const index = Number.parseInt(panelBlockEle.dataset.index, 10);
    const comment = comments[index];

    let closeEditModalFunction: () => void;

    const editFunction = (formEvent: Event) => {
      formEvent.preventDefault();

      cityssm.postJSON(urlPrefix + "/edit/doUpdateComment",
        formEvent.currentTarget,
        (responseJSON: { success: boolean; message?: string }) => {

          if (responseJSON.success) {
            getComments();
            closeEditModalFunction();
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

        (document.querySelector("#editComment--commentLogID") as HTMLInputElement).value = comment.commentLogID.toString();

        const commentTime = new Date(comment.commentTime);
        (document.querySelector("#editComment--commentDateString") as HTMLInputElement).value = cityssm.dateToString(commentTime);
        (document.querySelector("#editComment--commentTimeString") as HTMLInputElement).value = cityssm.dateToTimeString(commentTime);

        (document.querySelector("#editComment--comment") as HTMLTextAreaElement).value = comment.comment;

        document.querySelector("#form--editComment").addEventListener("submit", editFunction);
      },
      onshown: (_modalEle, closeModalFunction) => {
        closeEditModalFunction = closeModalFunction;
      }
    });
  };

  const openRemoveCommentModalFunction = (clickEvent: MouseEvent) => {

    clickEvent.preventDefault();

    const panelBlockEle = (clickEvent.currentTarget as HTMLElement).closest(".panel-block") as HTMLElement;

    const index = Number.parseInt(panelBlockEle.dataset.index, 10);
    const comment = comments[index];

    const removeFunction = () => {

      cityssm.postJSON(urlPrefix + "/edit/doRemoveComment", {
        commentLogID: comment.commentLogID
      }, (responseJSON: { success: boolean; message?: string }) => {

        if (responseJSON.success) {
          comments.splice(index, 1);
          crmEdit.clearPanelBlocksFunction(commentPanelEle);
          renderCommentsFunction();

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
      removeFunction);
  };

  const renderCommentFunction = (comment: recordTypes.RecordComment, index: number) => {

    const panelBlockEle = document.createElement("div");
    panelBlockEle.className = "panel-block is-block";
    panelBlockEle.dataset.commentLogId = comment.commentLogID.toString();
    panelBlockEle.dataset.index = index.toString();

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

    const buttonEles = panelBlockEle.querySelectorAll("button");
    buttonEles[0].addEventListener("click", openEditCommentModalFunction);
    buttonEles[1].addEventListener("click", openRemoveCommentModalFunction);

    commentPanelEle.append(panelBlockEle);
  };

  const renderCommentsFunction = () => {

    crmEdit.clearPanelBlocksFunction(commentPanelEle);

    if (comments.length === 0) {
      commentPanelEle.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
        "<div class=\"message is-info\">" +
        "<div class=\"message-body\">This record has no comments.</div>" +
        "</div>" +
        "</div>");

      return;
    }

    for (const [index, comment] of comments.entries()) {
      renderCommentFunction(comment, index);
    }
  };

  const getComments = () => {

    crmEdit.clearPanelBlocksFunction(commentPanelEle);
    comments = [];

    commentPanelEle.insertAdjacentHTML("beforeend", crmEdit.getLoadingPanelBlockHTML("Comments"));

    cityssm.postJSON(urlPrefix + "/view/doGetComments", {
      recordID: crmEdit.recordID
    },
      (responseJSON: { success: boolean; comments: recordTypes.RecordComment[]; message?: string }) => {

        if (responseJSON.success) {
          comments = responseJSON.comments;
          renderCommentsFunction();
        } else {

          commentPanelEle.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
            "<div class=\"message is-danger\"><div class=\"message-body\">" +
            responseJSON.message +
            "</div></div>" +
            "</div>");
        }
      });
  };

  renderCommentsFunction();

  document.querySelector("#is-add-comment-button").addEventListener("click", () => {

    let closeAddModalFunction: () => void;

    const addFunction = (formEvent: Event) => {
      formEvent.preventDefault();

      cityssm.postJSON(urlPrefix + "/edit/doAddComment",
        formEvent.currentTarget,
        (responseJSON: { success: boolean; message?: string }) => {

          if (responseJSON.success) {
            getComments();
            closeAddModalFunction();
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
        (document.querySelector("#addComment--recordID") as HTMLInputElement).value = crmEdit.recordID;

        const rightNow = new Date();
        (document.querySelector("#addComment--commentDateString") as HTMLInputElement).value = cityssm.dateToString(rightNow);
        (document.querySelector("#addComment--commentTimeString") as HTMLInputElement).value = cityssm.dateToTimeString(rightNow);
      },
      onshown: (_modalEle, closeModalFunction) => {
        closeAddModalFunction = closeModalFunction;
        document.querySelector("#form--addComment").addEventListener("submit", addFunction);
      }
    });
  });
})();
