/* eslint-disable unicorn/prefer-module */

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
declare const cityssm: cityssmGlobal;


(() => {
  const urlPrefix: string = exports.urlPrefix;

  const purgeTableFunction = (clickEvent: Event) => {

    const buttonElement = clickEvent.currentTarget as HTMLButtonElement;
    buttonElement.disabled = true;

    const tableName = buttonElement.dataset.table;

    const purgeFunction = () => {

      cityssm.postJSON(urlPrefix + "/admin/doTableCleanup", {
        tableName
      },
        (responseJSON: { success: boolean; message?: string; recordCount?: number }) => {

          if (responseJSON.success) {

            cityssm.alertModal("Table Cleaned Successfully",
              responseJSON.recordCount.toString() + " row" + (responseJSON.recordCount === 1 ? "" : "s") + " deleted.",
              "OK",
              "success");

          } else {

            cityssm.alertModal("Error Cleaning Table",
              cityssm.escapeHTML(responseJSON.message),
              "OK",
              "danger");

            buttonElement.disabled = false;
          }
        });
    };

    cityssm.confirmModal("Cleanup " + tableName,
      "Are you sure you want to permanently delete all deleted records in the " + tableName + " table?",
      "Yes, Cleanup",
      "warning",
      purgeFunction);
  };

  const purgeButtonElements = document.querySelector("#adminTabpanel--tableCleanup").querySelectorAll(".is-purge-button");

  for (const purgeButtonElement of purgeButtonElements) {
    purgeButtonElement.addEventListener("click", purgeTableFunction);
  }
})();
