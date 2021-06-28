import type * as recordTypes from "../../types/recordTypes";
import type { CRMAdmin } from "./main.js";

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
declare const cityssm: cityssmGlobal;


(() => {

  const crmAdmin: CRMAdmin = exports.crmAdmin;
  const urlPrefix: string = exports.urlPrefix;

  const statusTypesContainerEle = document.getElementById("container--statusTypes");
  const recordTypesFilterEle = document.getElementById("statusTypesFilter--recordTypeKey") as HTMLSelectElement;

  let statusTypes: recordTypes.StatusType[] = [];

  const getStatusTypeFromEventFn = (clickEvent: Event) => {

    const buttonEle = clickEvent.currentTarget as HTMLButtonElement;

    const trEle = buttonEle.closest("tr");

    const statusTypeIndex = parseInt(trEle.getAttribute("data-index"), 10);
    const statusType = statusTypes[statusTypeIndex];

    return {
      buttonEle,
      trEle,
      statusTypeIndex,
      statusType
    };
  };

  const toggleStatusTypeActiveFn = (clickEvent: Event) => {

    const { buttonEle, statusType } = getStatusTypeFromEventFn(clickEvent);

    buttonEle.disabled = true;

    const newIsActive = !statusType.isActive;

    cityssm.postJSON(urlPrefix + "/admin/doSetStatusTypeIsActive", {
      statusTypeKey: statusType.statusTypeKey,
      isActive: newIsActive
    }, (responseJSON: { success: boolean; message?: string }) => {

      buttonEle.disabled = false;

      if (responseJSON.success) {

        statusType.isActive = newIsActive;

        if (newIsActive) {
          buttonEle.innerHTML = "<i class=\"fas fa-check\" aria-label=\"Active Status Type\"></i>";

        } else {
          buttonEle.innerHTML = "<i class=\"fas fa-minus\" aria-label=\"False\"></i>";
        }

      } else {
        cityssm.alertModal("Status Type Not Updated",
          cityssm.escapeHTML(responseJSON.message),
          "OK",
          "danger");
      }
    });
  };

  const setStatusTypeOrderNumberFn = (statusTypeKey: string, newOrderNumber: number) => {

    cityssm.postJSON(urlPrefix + "/admin/doSetStatusTypeOrderNumber", {
      statusTypeKey: statusTypeKey,
      orderNumber: newOrderNumber
    }, (responseJSON: { success: boolean; message?: string; statusTypes?: recordTypes.StatusType[] }) => {

      if (responseJSON.success) {
        statusTypes = responseJSON.statusTypes;
        renderStatusTypesFn();
      } else {
        cityssm.alertModal("Error Moving Status Type",
          cityssm.escapeHTML(responseJSON.message),
          "OK",
          "danger");
      }
    });
  };

  const moveStatusTypeUpFn = (clickEvent: Event) => {

    const { buttonEle, statusType } = getStatusTypeFromEventFn(clickEvent);

    buttonEle.disabled = true;

    setStatusTypeOrderNumberFn(statusType.statusTypeKey, statusType.orderNumber - 1);
  };

  const moveStatusTypeDownFn = (clickEvent: Event) => {

    const { buttonEle, statusType } = getStatusTypeFromEventFn(clickEvent);

    buttonEle.disabled = true;

    setStatusTypeOrderNumberFn(statusType.statusTypeKey, statusType.orderNumber + 1);
  };

  const updateStatusTypeFn = (clickEvent: Event) => {

    const { statusType } = getStatusTypeFromEventFn(clickEvent);

    let formEle: HTMLFormElement;
    let updateStatusTypeCloseModalFn: () => void;

    const submitFn = (formEvent: Event) => {
      formEvent.preventDefault();

      cityssm.postJSON(urlPrefix + "/admin/doUpdateStatusType", formEle,
        (responseJSON: { success: true; message?: string; statusTypes?: recordTypes.StatusType[] }) => {

          if (responseJSON.success) {

            updateStatusTypeCloseModalFn();
            statusTypes = responseJSON.statusTypes;
            renderStatusTypesFn();

          } else {
            cityssm.alertModal("Error Updating Status Type",
              cityssm.escapeHTML(responseJSON.message),
              "OK",
              "danger");
          }
        });
    };

    cityssm.openHtmlModal("statusType-edit", {
      onshow: () => {
        (document.getElementById("editStatusType--statusTypeKey") as HTMLInputElement).value = statusType.statusTypeKey;
        (document.getElementById("editStatusType--statusType") as HTMLInputElement).value = statusType.statusType;

        formEle = document.getElementById("form--editStatusType") as HTMLFormElement;
        formEle.addEventListener("submit", submitFn);
      },
      onshown: (_modalEle, closeModalFn) => {
        updateStatusTypeCloseModalFn = closeModalFn;
      }
    });
  };

  const removeStatusTypeFn = (clickEvent: Event) => {

    const { statusType } = getStatusTypeFromEventFn(clickEvent);

    const removeFn = () => {
      cityssm.postJSON(urlPrefix + "/admin/doRemoveStatusType", {
        statusTypeKey: statusType.statusTypeKey
      }, (responseJSON: { success: boolean; message?: string; statusTypes?: recordTypes.StatusType[] }) => {

        if (responseJSON.success) {
          statusTypes = responseJSON.statusTypes;
          renderStatusTypesFn();
        } else {
          cityssm.alertModal("Error Removing Status Type",
            cityssm.escapeHTML(responseJSON.message),
            "OK",
            "danger");
        }
      });
    };

    cityssm.confirmModal("Remove Status Type",
      "Are you sure you want to remove the \"" + cityssm.escapeHTML(statusType.statusType) + "\" status type?",
      "Yes, Remove It",
      "warning",
      removeFn);
  };

  const renderStatusTypesFn = () => {

    const recordTypeKey = recordTypesFilterEle.value;

    let hasStatusTypes = false;

    const tableEle = document.createElement("table");

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

    const tbodyEle = tableEle.getElementsByTagName("tbody")[0];

    for (let index = 0; index < statusTypes.length; index += 1) {

      const statusType = statusTypes[index];

      if (recordTypeKey !== statusType.recordTypeKey) {
        continue;
      }

      const trEle = document.createElement("tr");

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

      const trEles = tbodyEle.getElementsByTagName("tr");
      (trEles[0].getElementsByClassName("is-up-button")[0] as HTMLButtonElement).disabled = true;
      (trEles[trEles.length - 1].getElementsByClassName("is-down-button")[0] as HTMLButtonElement).disabled = true;

      statusTypesContainerEle.appendChild(tableEle);
    } else {
      statusTypesContainerEle.innerHTML = "<div class=\"message is-info\">" +
        "<p class=\"message-body\">There are no status types associated with the selected record type.</p>" +
        "</div>";
    }
  };

  crmAdmin.getStatusTypesFn = () => {

    statusTypes = [];

    cityssm.clearElement(statusTypesContainerEle);
    statusTypesContainerEle.innerHTML = crmAdmin.getLoadingHTML("Status Types");

    cityssm.postJSON(urlPrefix + "/admin/doGetStatusTypes", {}, (responseJSON: { statusTypes: recordTypes.StatusType[] }) => {
      statusTypes = responseJSON.statusTypes;
      renderStatusTypesFn();
    });
  };

  recordTypesFilterEle.addEventListener("change", renderStatusTypesFn);

  document.getElementById("is-add-status-type-button").addEventListener("click", () => {

    let addStatusTypeCloseModalFn: () => void;
    let formEle: HTMLFormElement;

    const submitFn = (formEvent: Event) => {
      formEvent.preventDefault();

      cityssm.postJSON(urlPrefix + "/admin/doAddStatusType", formEle,
        (responseJSON: { success: boolean; message?: string; statusTypes?: recordTypes.StatusType[] }) => {

          if (responseJSON.success) {

            addStatusTypeCloseModalFn();
            statusTypes = responseJSON.statusTypes;
            renderStatusTypesFn();

          } else {
            cityssm.alertModal("Error Adding Status Type",
              cityssm.escapeHTML(responseJSON.message),
              "OK",
              "danger");
          }
        });
    };

    cityssm.openHtmlModal("statusType-add", {
      onshow: () => {

        const recordType = crmAdmin.recordTypes.find((currentRecordType) => {
          return currentRecordType.recordTypeKey === recordTypesFilterEle.value;
        });

        document.getElementById("addStatusType--recordType").innerText = recordType.recordType;
        (document.getElementById("addStatusType--recordTypeKey") as HTMLInputElement).value = recordTypesFilterEle.value;

        formEle = document.getElementById("form--addStatusType") as HTMLFormElement;
        formEle.addEventListener("submit", submitFn);
      },
      onshown: (_modalEle, closeModalFn) => {
        addStatusTypeCloseModalFn = closeModalFn;
      }
    });
  });
})();
