/* eslint-disable unicorn/prefer-module */

import type * as recordTypes from "../../types/recordTypes";

import type { CRM } from "../../types/clientTypes";
import type { CRMEdit } from "./main";

import type { BulmaJS } from "@cityssm/bulma-js/types";
import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";

declare const bulmaJS: BulmaJS;
declare const cityssm: cityssmGlobal;


(() => {

  const crm: CRM = exports.crm;

  const urlPrefix: string = exports.urlPrefix;
  const crmEdit: CRMEdit = exports.crmEdit;

  let relatedRecords: recordTypes.Record[] = exports.relatedRecords;
  delete exports.relatedRecords;

  const relatedRecordPanelElement = document.querySelector("#panel--relatedRecords") as HTMLElement;

  const openRemoveRelatedRecordModalFunction = (clickEvent: MouseEvent) => {

    clickEvent.preventDefault();

    const panelBlockElement = (clickEvent.currentTarget as HTMLElement).closest(".panel-block") as HTMLElement;

    const index = Number.parseInt(panelBlockElement.dataset.index, 10);
    const relatedRecordID = Number.parseInt(panelBlockElement.dataset.recordId, 10);

    const removeFunction = () => {

      cityssm.postJSON(urlPrefix + "/edit/doRemoveRelatedRecord", {
        recordID: crmEdit.recordID,
        relatedRecordID
      }, (responseJSON: { success: boolean; message?: string }) => {

        if (responseJSON.success) {
          relatedRecords.splice(index, 1);
          crmEdit.clearPanelBlocksFunction(relatedRecordPanelElement);
          renderRelatedRecordsFunction();

        } else {
          cityssm.alertModal("Remove Related Record Error",
            cityssm.escapeHTML(responseJSON.message),
            "OK",
            "danger");
        }
      });
    };

    cityssm.confirmModal("Remove Comment",
      "Are you sure you want to remove this related record?",
      "Yes, Remove the Related Record",
      "warning",
      removeFunction);
  };

  const renderRelatedRecordFunction = (relatedRecord: recordTypes.Record, index: number) => {

    const panelBlockElement = crm.renderRecordPanelLinkEle(relatedRecord, {
      panelTag: "div",
      includeRemoveButton: true
    });

    panelBlockElement.dataset.index = index.toString();
    panelBlockElement.dataset.recordId = relatedRecord.recordID.toString();

    panelBlockElement.querySelectorAll("button")[0].addEventListener("click", openRemoveRelatedRecordModalFunction);

    relatedRecordPanelElement.append(panelBlockElement);
  };

  const renderRelatedRecordsFunction = () => {

    crmEdit.clearPanelBlocksFunction(relatedRecordPanelElement);

    if (relatedRecords.length === 0) {
      relatedRecordPanelElement.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
        "<div class=\"message is-info\">" +
        "<div class=\"message-body\">This record has no related records.</div>" +
        "</div>" +
        "</div>");

      return;
    }

    for (const [index, relatedRecord] of relatedRecords.entries()) {
      renderRelatedRecordFunction(relatedRecord, index);
    }

  };

  const getRelatedRecords = () => {

    crmEdit.clearPanelBlocksFunction(relatedRecordPanelElement);
    relatedRecords = [];

    relatedRecordPanelElement.insertAdjacentHTML("beforeend", crmEdit.getLoadingPanelBlockHTML("Related Records"));

    cityssm.postJSON(urlPrefix + "/view/doGetRelatedRecords", {
      recordID: crmEdit.recordID
    },
      (responseJSON: { success: boolean; relatedRecords: recordTypes.Record[]; message?: string }) => {

        if (responseJSON.success) {
          relatedRecords = responseJSON.relatedRecords;
          renderRelatedRecordsFunction();
        } else {

          relatedRecordPanelElement.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
            "<div class=\"message is-danger\"><div class=\"message-body\">" +
            responseJSON.message +
            "</div></div>" +
            "</div>");
        }
      });
  };

  renderRelatedRecordsFunction();

  document.querySelector("#is-add-related-button").addEventListener("click", () => {

    let doRefreshOnClose = false;

    let searchFormElement: HTMLFormElement;
    let searchResultsContainerElement: HTMLElement;

    const addFunction = (event: MouseEvent) => {

      event.preventDefault();

      const buttonElement = event.currentTarget as HTMLButtonElement;

      buttonElement.disabled = true;

      const panelBlockElement = buttonElement.closest(".panel-block") as HTMLElement;

      const relatedRecordID = panelBlockElement.dataset.recordId;

      cityssm.postJSON(urlPrefix + "/edit/doAddRelatedRecord", {
        recordID: crmEdit.recordID,
        relatedRecordID: relatedRecordID
      },
        (responseJSON: { success: boolean; message?: string }) => {

          if (responseJSON.success) {
            doRefreshOnClose = true;
            panelBlockElement.remove();

          } else {
            cityssm.alertModal("Error Adding Related Record",
              cityssm.escapeHTML(responseJSON.message),
              "OK",
              "danger");

            buttonElement.disabled = false;
          }
        });
    };

    const searchRecordsFunction = (event?: Event) => {

      if (event) {
        event.preventDefault();
      }

      searchResultsContainerElement.innerHTML = "<div class=\"has-text-centered has-text-grey\">" +
        "<i class=\"fas fa-4x fa-spinner fa-pulse\" aria-hidden=\"true\"></i><br />" +
        "Searching Records..." +
        "</div>";

      cityssm.postJSON(urlPrefix + "/edit/doSearchRelatedRecords", searchFormElement,
        (responseJSON: { success: boolean; message?: string; records?: recordTypes.Record[] }) => {

          if (!responseJSON.success) {

            searchResultsContainerElement.innerHTML = "<div class=\"message is-danger\">" +
              "<div class=\"message-body\">" +
              "<p>" + cityssm.escapeHTML(responseJSON.message) + "</p>" +
              "</div>" +
              "</div>";

            return;
          }

          const panelElement = document.createElement("div");
          panelElement.className = "panel";

          for (const relatedRecord of responseJSON.records) {

            const panelBlockElement = crm.renderRecordPanelLinkEle(relatedRecord, {
              panelTag: "div",
              includeAddButton: true
            });

            panelBlockElement.dataset.recordId = relatedRecord.recordID.toString();

            panelBlockElement.querySelector("button").addEventListener("click", addFunction);

            panelElement.append(panelBlockElement);
          }

          searchResultsContainerElement.innerHTML = "";

          if (panelElement.children.length === 0) {
            searchResultsContainerElement.innerHTML = "<div class=\"message is-info\">" +
              "<div class=\"message-body\">" +
              "<p>There are no new records that meet your search criteria.</p>" +
              "</div>" +
              "</div>";

          } else {
            searchResultsContainerElement.append(panelElement);
          }
        });
    };

    cityssm.openHtmlModal("relatedRecord-add", {
      onshow: () => {

        searchResultsContainerElement = document.querySelector("#container--addRelatedRecord");

        searchFormElement = document.querySelector("#form--addRelatedRecord-search") as HTMLFormElement;
        searchFormElement.addEventListener("submit", searchRecordsFunction);

        (document.querySelector("#addRelatedRecord--recordID") as HTMLInputElement).value = crmEdit.recordID;

        const recordTypeKeyElement = document.querySelector("#addRelatedRecord--recordTypeKey") as HTMLSelectElement;

        for (let index = 0; index < exports.recordTypes.length; index += 1) {
          const optionElement = document.createElement("option");
          optionElement.value = exports.recordTypes[index].recordTypeKey;
          optionElement.textContent = exports.recordTypes[index].recordType;
          recordTypeKeyElement.append(optionElement);

          if (index === 0) {
            recordTypeKeyElement.value = index.toString();
          }
        }

        recordTypeKeyElement.addEventListener("change", searchRecordsFunction);

        const searchStringElement = document.querySelector("#addRelatedRecord--searchString") as HTMLInputElement;
        searchStringElement.value = (document.querySelector("#record--recordNumber") as HTMLInputElement).value;

        searchRecordsFunction();
      },
      onshown: () => {
        bulmaJS.toggleHtmlClipped();
      },
      onhidden: () => {
        if (doRefreshOnClose) {
          getRelatedRecords();
        }
      },
      onremoved: () => {
        bulmaJS.toggleHtmlClipped();
      }
    });
  });
})();
