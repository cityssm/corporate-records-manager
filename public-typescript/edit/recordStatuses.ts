/* eslint-disable unicorn/prefer-module */

import type * as recordTypes from "../../types/recordTypes";

import type { CRMEdit } from "./main";

import type { BulmaJS } from "@cityssm/bulma-js/types";
import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";

declare const bulmaJS: BulmaJS;
declare const cityssm: cityssmGlobal;


(() => {

  const urlPrefix: string = exports.urlPrefix;
  const crmEdit: CRMEdit = exports.crmEdit;

  const statusPanelElement = document.querySelector("#panel--statuses") as HTMLElement;

  if (!statusPanelElement) {
    return;
  }

  let statuses: recordTypes.RecordStatus[] = exports.recordStatuses;
  delete exports.recordStatuses;

  const openEditStatusModalFunction = (clickEvent: MouseEvent) => {

    clickEvent.preventDefault();

    const panelBlockElement = (clickEvent.currentTarget as HTMLElement).closest(".panel-block") as HTMLElement;

    const index = Number.parseInt(panelBlockElement.dataset.index, 10);
    const status = statuses[index];

    let closeEditModalFunction: () => void;

    const editFunction = (formEvent: Event) => {
      formEvent.preventDefault();

      cityssm.postJSON(urlPrefix + "/edit/doUpdateStatus",
        formEvent.currentTarget,
        (responseJSON: { success: boolean; message?: string }) => {

          if (responseJSON.success) {
            getStatuses();
            closeEditModalFunction();
          } else {
            cityssm.alertModal("Update Status Error",
              cityssm.escapeHTML(responseJSON.message),
              "OK",
              "danger");
          }
        });
    };

    cityssm.openHtmlModal("status-edit", {
      onshow: () => {

        (document.querySelector("#editStatus--statusLogID") as HTMLInputElement).value = status.statusLogID.toString();

        const statusTypeKeyElement = document.querySelector("#editStatus--statusTypeKey") as HTMLSelectElement;
        const statusTypes: recordTypes.StatusType[] = exports.statusTypes;

        let statusTypeKeyFound = false;

        for (const statusType of statusTypes) {

          if (statusType.isActive || statusType.statusTypeKey === status.statusTypeKey) {
            statusTypeKeyElement.insertAdjacentHTML("beforeend",
              "<option value=\"" + cityssm.escapeHTML(statusType.statusTypeKey) + "\">" +
              cityssm.escapeHTML(statusType.statusType) +
              "</option>");

            if (statusType.statusTypeKey === status.statusTypeKey) {
              statusTypeKeyFound = true;
            }
          }
        }

        if (!statusTypeKeyFound) {
          statusTypeKeyElement.insertAdjacentHTML("beforeend",
            "<option value=\"" + cityssm.escapeHTML(status.statusTypeKey) + "\">" +
            cityssm.escapeHTML(status.statusTypeKey) +
            "</option>");
        }

        statusTypeKeyElement.value = status.statusTypeKey;

        const statusTime = new Date(status.statusTime);
        (document.querySelector("#editStatus--statusDateString") as HTMLInputElement).value = cityssm.dateToString(statusTime);
        (document.querySelector("#editStatus--statusTimeString") as HTMLInputElement).value = cityssm.dateToTimeString(statusTime);

        (document.querySelector("#editStatus--statusLog") as HTMLTextAreaElement).value = status.statusLog;

        document.querySelector("#form--editStatus").addEventListener("submit", editFunction);
      },
      onshown: (_modalElement, closeModalFunction) => {
        bulmaJS.toggleHtmlClipped();
        closeEditModalFunction = closeModalFunction;
      },
      onremoved: () => {
        bulmaJS.toggleHtmlClipped();
      }
    });
  };

  const openRemoveStatusModalFunction = (clickEvent: MouseEvent) => {

    clickEvent.preventDefault();

    const panelBlockElement = (clickEvent.currentTarget as HTMLElement).closest(".panel-block") as HTMLElement;

    const index = Number.parseInt(panelBlockElement.dataset.index, 10);
    const status = statuses[index];

    const removeFunction = () => {

      cityssm.postJSON(urlPrefix + "/edit/doRemoveStatus", {
        statusLogID: status.statusLogID
      }, (responseJSON: { success: boolean; message?: string }) => {

        if (responseJSON.success) {
          statuses.splice(index, 1);
          crmEdit.clearPanelBlocksFunction(statusPanelElement);
          renderStatusesFunction();

        } else {
          cityssm.alertModal("Remove Status Error",
            cityssm.escapeHTML(responseJSON.message),
            "OK",
            "danger");
        }
      });
    };

    cityssm.confirmModal("Remove Status",
      "Are you sure you want to remove this status?<br />" +
      "If the status of this record has changed, it would be better to add a new status.",
      "Yes, Remove the Status",
      "warning",
      removeFunction);
  };

  const renderStatusFunction = (status: recordTypes.RecordStatus, index: number) => {

    const panelBlockElement = document.createElement("div");
    panelBlockElement.className = "panel-block is-block";
    panelBlockElement.dataset.statusLogId = status.statusLogID.toString();
    panelBlockElement.dataset.index = index.toString();

    const statusType: recordTypes.StatusType = exports.statusTypes.find((possibleStatusType: recordTypes.StatusType) => {
      return possibleStatusType.statusTypeKey === status.statusTypeKey;
    });

    const statusTime = new Date(status.statusTime);

    panelBlockElement.innerHTML = "<div class=\"columns\">" +
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
        " <button class=\"button is-danger is-light is-small has-tooltip-arrow has-tooltip-left\" data-tooltip=\"Remove Status\" aria-label=\"Remove Status\" type=\"button\">" +
        "<span class=\"icon\"><i class=\"fas fa-trash-alt\" aria-hidden=\"true\"></i></span>" +
        "</button>" +
        "</div>") +
      "</div>";

    const buttonElements = panelBlockElement.querySelectorAll("button");
    buttonElements[0].addEventListener("click", openEditStatusModalFunction);
    buttonElements[1].addEventListener("click", openRemoveStatusModalFunction);

    statusPanelElement.append(panelBlockElement);
  };

  const renderStatusesFunction = () => {

    crmEdit.clearPanelBlocksFunction(statusPanelElement);

    if (statuses.length === 0) {
      statusPanelElement.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
        "<div class=\"message is-warning\">" +
        "<div class=\"message-body\">There are no statuses associated with this record.</div>" +
        "</div>" +
        "</div>");

      return;
    }

    for (const [index, status] of statuses.entries()) {
      renderStatusFunction(status, index);
    }
  };

  const getStatuses = () => {

    crmEdit.clearPanelBlocksFunction(statusPanelElement);
    statuses = [];

    statusPanelElement.insertAdjacentHTML("beforeend", crmEdit.getLoadingPanelBlockHTML("Statuses"));

    cityssm.postJSON(urlPrefix + "/view/doGetStatuses", {
      recordID: crmEdit.recordID
    },
      (responseJSON: { success: boolean; statuses: recordTypes.RecordStatus[]; message?: string }) => {

        if (responseJSON.success) {
          statuses = responseJSON.statuses;
          renderStatusesFunction();
        } else {

          statusPanelElement.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
            "<div class=\"message is-danger\"><div class=\"message-body\">" +
            responseJSON.message +
            "</div></div>" +
            "</div>");
        }
      });
  };

  renderStatusesFunction();

  const addStatusButtonElement = document.querySelector("#is-add-status-button");

  if (addStatusButtonElement) {

    addStatusButtonElement.addEventListener("click", () => {

      let closeAddModalFunction: () => void;

      const addFunction = (formEvent: Event) => {
        formEvent.preventDefault();

        cityssm.postJSON(urlPrefix + "/edit/doAddStatus",
          formEvent.currentTarget,
          (responseJSON: { success: boolean; message?: string }) => {

            if (responseJSON.success) {
              getStatuses();
              closeAddModalFunction();
            } else {
              cityssm.alertModal("Add Status Error",
                cityssm.escapeHTML(responseJSON.message),
                "OK",
                "danger");
            }
          });
      };

      cityssm.openHtmlModal("status-add", {
        onshow: () => {
          (document.querySelector("#addStatus--recordID") as HTMLInputElement).value = crmEdit.recordID;

          const statusTypeKeyElement = document.querySelector("#addStatus--statusTypeKey") as HTMLSelectElement;
          const statusTypes: recordTypes.StatusType[] = exports.statusTypes;

          for (const statusType of statusTypes) {

            if (statusType.isActive) {
              statusTypeKeyElement.insertAdjacentHTML("beforeend",
                "<option value=\"" + cityssm.escapeHTML(statusType.statusTypeKey) + "\">" +
                cityssm.escapeHTML(statusType.statusType) +
                "</option>");
            }
          }

          const rightNow = new Date();
          (document.querySelector("#addStatus--statusDateString") as HTMLInputElement).value = cityssm.dateToString(rightNow);
          (document.querySelector("#addStatus--statusTimeString") as HTMLInputElement).value = cityssm.dateToTimeString(rightNow);

        },
        onshown: (_modalElement, closeModalFunction) => {
          bulmaJS.toggleHtmlClipped();
          closeAddModalFunction = closeModalFunction;
          document.querySelector("#form--addStatus").addEventListener("submit", addFunction);
        },
        onremoved: () => {
          bulmaJS.toggleHtmlClipped();
        }
      });
    });
  }
})();
