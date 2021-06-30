/* eslint-disable unicorn/prefer-module */

import type * as recordTypes from "../../types/recordTypes";

import type { CRM } from "../../types/clientTypes";
import type { CRMEdit } from "./main";

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
declare const cityssm: cityssmGlobal;


(() => {

  const crm: CRM = exports.crm;

  const urlPrefix: string = exports.urlPrefix;
  const crmEdit: CRMEdit = exports.crmEdit;

  let relatedRecords: recordTypes.Record[] = exports.relatedRecords;
  delete exports.relatedRecords;

  const relatedRecordPanelEle = document.querySelector("#panel--relatedRecords") as HTMLElement;

  const openRemoveRelatedRecordModalFunction = (clickEvent: MouseEvent) => {

    clickEvent.preventDefault();

    const panelBlockEle = (clickEvent.currentTarget as HTMLElement).closest(".panel-block") as HTMLElement;

    const index = Number.parseInt(panelBlockEle.dataset.index, 10);
    const relatedRecordID = Number.parseInt(panelBlockEle.dataset.recordId, 10);

    const removeFunction = () => {

      cityssm.postJSON(urlPrefix + "/edit/doRemoveRelatedRecord", {
        recordID: crmEdit.recordID,
        relatedRecordID
      }, (responseJSON: { success: boolean; message?: string }) => {

        if (responseJSON.success) {
          relatedRecords.splice(index, 1);
          crmEdit.clearPanelBlocksFunction(relatedRecordPanelEle);
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

    const panelBlockEle = crm.renderRecordPanelLinkEle(relatedRecord, {
      panelTag: "div",
      includeRemoveButton: true
    });

    panelBlockEle.dataset.index = index.toString();
    panelBlockEle.dataset.recordId = relatedRecord.recordID.toString();

    panelBlockEle.querySelectorAll("button")[0].addEventListener("click", openRemoveRelatedRecordModalFunction);

    relatedRecordPanelEle.append(panelBlockEle);
  };

  const renderRelatedRecordsFunction = () => {

    crmEdit.clearPanelBlocksFunction(relatedRecordPanelEle);

    if (relatedRecords.length === 0) {
      relatedRecordPanelEle.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
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

    crmEdit.clearPanelBlocksFunction(relatedRecordPanelEle);
    relatedRecords = [];

    relatedRecordPanelEle.insertAdjacentHTML("beforeend", crmEdit.getLoadingPanelBlockHTML("Related Records"));

    cityssm.postJSON(urlPrefix + "/view/doGetRelatedRecords", {
      recordID: crmEdit.recordID
    },
      (responseJSON: { success: boolean; relatedRecords: recordTypes.Record[]; message?: string }) => {

        if (responseJSON.success) {
          relatedRecords = responseJSON.relatedRecords;
          renderRelatedRecordsFunction();
        } else {

          relatedRecordPanelEle.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
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

    let searchFormEle: HTMLFormElement;
    let searchResultsContainerEle: HTMLElement;

    const addFunction = (event: MouseEvent) => {

      event.preventDefault();

      const buttonEle = event.currentTarget as HTMLButtonElement;

      buttonEle.disabled = true;

      const panelBlockEle = buttonEle.closest(".panel-block") as HTMLElement;

      const relatedRecordID = panelBlockEle.dataset.recordId;

      cityssm.postJSON(urlPrefix + "/edit/doAddRelatedRecord", {
        recordID: crmEdit.recordID,
        relatedRecordID: relatedRecordID
      },
        (responseJSON: { success: boolean; message?: string }) => {

          if (responseJSON.success) {
            doRefreshOnClose = true;
            panelBlockEle.remove();

          } else {
            cityssm.alertModal("Error Adding Related Record",
              cityssm.escapeHTML(responseJSON.message),
              "OK",
              "danger");

            buttonEle.disabled = false;
          }
        });
    };

    const searchRecordsFunction = (event?: Event) => {

      if (event) {
        event.preventDefault();
      }

      searchResultsContainerEle.innerHTML = "<div class=\"has-text-centered has-text-grey\">" +
        "<i class=\"fas fa-4x fa-spinner fa-pulse\" aria-hidden=\"true\"></i><br />" +
        "Searching Records..." +
        "</div>";

      cityssm.postJSON(urlPrefix + "/edit/doSearchRelatedRecords", searchFormEle,
        (responseJSON: { success: boolean; message?: string; records?: recordTypes.Record[] }) => {

          if (!responseJSON.success) {

            searchResultsContainerEle.innerHTML = "<div class=\"message is-danger\">" +
              "<div class=\"message-body\">" +
              "<p>" + cityssm.escapeHTML(responseJSON.message) + "</p>" +
              "</div>" +
              "</div>";

            return;
          }

          const panelEle = document.createElement("div");
          panelEle.className = "panel";

          for (const relatedRecord of responseJSON.records) {

            const panelBlockEle = crm.renderRecordPanelLinkEle(relatedRecord, {
              panelTag: "div",
              includeAddButton: true
            });

            panelBlockEle.dataset.recordId = relatedRecord.recordID.toString();

            panelBlockEle.querySelectorAll("button")[0].addEventListener("click", addFunction);

            panelEle.append(panelBlockEle);
          }

          searchResultsContainerEle.innerHTML = "";

          if (panelEle.children.length === 0) {
            searchResultsContainerEle.innerHTML = "<div class=\"message is-info\">" +
              "<div class=\"message-body\">" +
              "<p>There are no new records that meet your search criteria.</p>" +
              "</div>" +
              "</div>";

          } else {

            searchResultsContainerEle.append(panelEle);
          }
        });
    };

    cityssm.openHtmlModal("relatedRecord-add", {
      onshow: () => {

        searchResultsContainerEle = document.querySelector("#container--addRelatedRecord");

        searchFormEle = document.querySelector("#form--addRelatedRecord-search") as HTMLFormElement;
        searchFormEle.addEventListener("submit", searchRecordsFunction);

        (document.querySelector("#addRelatedRecord--recordID") as HTMLInputElement).value = crmEdit.recordID;

        const recordTypeKeyEle = document.querySelector("#addRelatedRecord--recordTypeKey") as HTMLSelectElement;

        for (let index = 0; index < exports.recordTypes.length; index += 1) {
          const optionEle = document.createElement("option");
          optionEle.value = exports.recordTypes[index].recordTypeKey;
          optionEle.textContent = exports.recordTypes[index].recordType;
          recordTypeKeyEle.append(optionEle);

          if (index === 0) {
            recordTypeKeyEle.value = index.toString();
          }
        }

        recordTypeKeyEle.addEventListener("change", searchRecordsFunction);

        const searchStringEle = document.querySelector("#addRelatedRecord--searchString") as HTMLInputElement;
        searchStringEle.value = (document.querySelector("#record--recordNumber") as HTMLInputElement).value;

        searchRecordsFunction();
      },
      onhidden: () => {
        if (doRefreshOnClose) {
          getRelatedRecords();
        }
      }
    });
  });
})();
