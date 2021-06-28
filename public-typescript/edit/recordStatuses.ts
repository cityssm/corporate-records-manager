import type * as recordTypes from "../../types/recordTypes";

import type { CRMEdit } from "./main";

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
declare const cityssm: cityssmGlobal;


(() => {

  const urlPrefix: string = exports.urlPrefix;
  const crmEdit: CRMEdit = exports.crmEdit;

  const statusPanelEle = document.getElementById("panel--statuses");

  if (statusPanelEle) {

    let statuses: recordTypes.RecordStatus[] = exports.recordStatuses;
    delete exports.recordStatuses;

    const openEditStatusModalFn = (clickEvent: MouseEvent) => {

      clickEvent.preventDefault();

      const panelBlockEle = (clickEvent.currentTarget as HTMLElement).closest(".panel-block");

      const index = parseInt(panelBlockEle.getAttribute("data-index"), 10);
      const status = statuses[index];

      let closeEditModalFn: () => void;

      const editFn = (formEvent: Event) => {
        formEvent.preventDefault();

        cityssm.postJSON(urlPrefix + "/edit/doUpdateStatus",
          formEvent.currentTarget,
          (responseJSON: { success: boolean; message?: string }) => {

            if (responseJSON.success) {
              getStatuses();
              closeEditModalFn();
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

          (document.getElementById("editStatus--statusLogID") as HTMLInputElement).value = status.statusLogID.toString();

          const statusTypeKeyEle = document.getElementById("editStatus--statusTypeKey") as HTMLSelectElement;
          const statusTypes: recordTypes.StatusType[] = exports.statusTypes;

          let statusTypeKeyFound = false;

          for (const statusType of statusTypes) {

            if (statusType.isActive || statusType.statusTypeKey === status.statusTypeKey) {
              statusTypeKeyEle.insertAdjacentHTML("beforeend",
                "<option value=\"" + cityssm.escapeHTML(statusType.statusTypeKey) + "\">" +
                cityssm.escapeHTML(statusType.statusType) +
                "</option>");

              if (statusType.statusTypeKey === status.statusTypeKey) {
                statusTypeKeyFound = true;
              }
            }
          }

          if (!statusTypeKeyFound) {
            statusTypeKeyEle.insertAdjacentHTML("beforeend",
              "<option value=\"" + cityssm.escapeHTML(status.statusTypeKey) + "\">" +
              cityssm.escapeHTML(status.statusTypeKey) +
              "</option>");
          }

          statusTypeKeyEle.value = status.statusTypeKey;

          const statusTime = new Date(status.statusTime);
          (document.getElementById("editStatus--statusDateString") as HTMLInputElement).value = cityssm.dateToString(statusTime);
          (document.getElementById("editStatus--statusTimeString") as HTMLInputElement).value = cityssm.dateToTimeString(statusTime);

          (document.getElementById("editStatus--statusLog") as HTMLTextAreaElement).value = status.statusLog;

          document.getElementById("form--editStatus").addEventListener("submit", editFn);
        },
        onshown: (_modalEle, closeModalFn) => {
          closeEditModalFn = closeModalFn;
        }
      });
    };

    const openRemoveStatusModalFn = (clickEvent: MouseEvent) => {

      clickEvent.preventDefault();

      const panelBlockEle = (clickEvent.currentTarget as HTMLElement).closest(".panel-block");

      const index = parseInt(panelBlockEle.getAttribute("data-index"), 10);
      const status = statuses[index];

      const removeFn = () => {

        cityssm.postJSON(urlPrefix + "/edit/doRemoveStatus", {
          statusLogID: status.statusLogID
        }, (responseJSON: { success: boolean; message?: string }) => {

          if (responseJSON.success) {
            statuses.splice(index, 1);
            crmEdit.clearPanelBlocksFn(statusPanelEle);
            renderStatusesFn();

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
        removeFn);
    };

    const renderStatusFn = (status: recordTypes.RecordStatus, index: number) => {

      const panelBlockEle = document.createElement("div");
      panelBlockEle.className = "panel-block is-block";
      panelBlockEle.setAttribute("data-status-log-id", status.statusLogID.toString());
      panelBlockEle.setAttribute("data-index", index.toString());

      const statusType: recordTypes.StatusType = exports.statusTypes.find((possibleStatusType: recordTypes.StatusType) => {
        return possibleStatusType.statusTypeKey === status.statusTypeKey;
      });

      const statusTime = new Date(status.statusTime);

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

      const buttonEles = panelBlockEle.getElementsByTagName("button");
      buttonEles[0].addEventListener("click", openEditStatusModalFn);
      buttonEles[1].addEventListener("click", openRemoveStatusModalFn);

      statusPanelEle.appendChild(panelBlockEle);
    };

    const renderStatusesFn = () => {

      crmEdit.clearPanelBlocksFn(statusPanelEle);

      if (statuses.length === 0) {
        statusPanelEle.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
          "<div class=\"message is-warning\">" +
          "<div class=\"message-body\">There are no statuses associated with this record.</div>" +
          "</div>" +
          "</div>");

        return;
      }

      statuses.forEach(renderStatusFn);
    };

    const getStatuses = () => {

      crmEdit.clearPanelBlocksFn(statusPanelEle);
      statuses = [];

      statusPanelEle.insertAdjacentHTML("beforeend", crmEdit.getLoadingPanelBlockHTML("Statuses"));

      cityssm.postJSON(urlPrefix + "/view/doGetStatuses", {
        recordID: crmEdit.recordID
      },
        (responseJSON: { success: boolean; statuses: recordTypes.RecordStatus[]; message?: string }) => {

          if (responseJSON.success) {
            statuses = responseJSON.statuses;
            renderStatusesFn();
          } else {

            statusPanelEle.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
              "<div class=\"message is-danger\"><div class=\"message-body\">" +
              responseJSON.message +
              "</div></div>" +
              "</div>");
          }
        });
    };

    renderStatusesFn();

    const addStatusButtonEle = document.getElementById("is-add-status-button");

    if (addStatusButtonEle) {

      addStatusButtonEle.addEventListener("click", () => {

        let closeAddModalFn: () => void;

        const addFn = (formEvent: Event) => {
          formEvent.preventDefault();

          cityssm.postJSON(urlPrefix + "/edit/doAddStatus",
            formEvent.currentTarget,
            (responseJSON: { success: boolean; message?: string }) => {

              if (responseJSON.success) {
                getStatuses();
                closeAddModalFn();
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
            (document.getElementById("addStatus--recordID") as HTMLInputElement).value = crmEdit.recordID;

            const statusTypeKeyEle = document.getElementById("addStatus--statusTypeKey") as HTMLSelectElement;
            const statusTypes: recordTypes.StatusType[] = exports.statusTypes;

            for (const statusType of statusTypes) {

              if (statusType.isActive) {
                statusTypeKeyEle.insertAdjacentHTML("beforeend",
                  "<option value=\"" + cityssm.escapeHTML(statusType.statusTypeKey) + "\">" +
                  cityssm.escapeHTML(statusType.statusType) +
                  "</option>");
              }
            }

            const rightNow = new Date();
            (document.getElementById("addStatus--statusDateString") as HTMLInputElement).value = cityssm.dateToString(rightNow);
            (document.getElementById("addStatus--statusTimeString") as HTMLInputElement).value = cityssm.dateToTimeString(rightNow);

          },
          onshown: (_modalEle, closeModalFn) => {
            closeAddModalFn = closeModalFn;
            document.getElementById("form--addStatus").addEventListener("submit", addFn);
          }
        });
      });
    }
  }

})();
