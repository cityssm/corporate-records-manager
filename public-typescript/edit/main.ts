/* eslint-disable unicorn/prefer-module */

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
declare const cityssm: cityssmGlobal;


export interface CRMEdit {
  recordID: string;
  getLoadingPanelBlockHTML: (sectionName: string) => string;
  clearPanelBlocksFunction: (panelElement: HTMLElement) => void;
}


(() => {
  const urlPrefix: string = exports.urlPrefix;
  const recordID = (document.querySelector("#record--recordID") as HTMLInputElement).value;

  document.querySelector("#is-remove-record-button").addEventListener("click", (clickEvent) => {
    clickEvent.preventDefault();

    const removeFunction = () => {

      cityssm.postJSON(urlPrefix + "/edit/doRemove", {
        recordID: recordID
      }, (responseJSON: { success: boolean; message?: string }) => {

        if (responseJSON.success) {
          window.location.href = urlPrefix + "/dashboard";
        } else {
          cityssm.alertModal("Record Remove Error",
            cityssm.escapeHTML(responseJSON.message),
            "OK",
            "danger");
        }
      });
    };

    cityssm.confirmModal("Remove Record?",
      "Are you sure you want to remove this record?",
      "Yes, Remove the Record",
      "warning",
      removeFunction
    );
  });

  const crmEdit: CRMEdit = {

    recordID,
    getLoadingPanelBlockHTML: (sectionName) => {
      return "<div class=\"panel-block is-block has-text-centered has-text-grey\">" +
        "<i class=\"fas fa-4x fa-spinner fa-pulse\" aria-hidden=\"true\"></i><br />" +
        "Loading " + sectionName + "..." +
        "</div>";
    },
    clearPanelBlocksFunction: (panelElement) => {

      const panelBlockElements = panelElement.querySelectorAll(".panel-block");

      for (const panelBlockElement of panelBlockElements) {
        panelBlockElement.remove();
      }
    }
  };

  exports.crmEdit = crmEdit;
})();
