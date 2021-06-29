/* eslint-disable unicorn/prefer-module */

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
declare const cityssm: cityssmGlobal;


(() => {
  const urlPrefix: string = exports.urlPrefix;

  const purgeTableFunction = (clickEvent: Event) => {

    const buttonEle = clickEvent.currentTarget as HTMLButtonElement;
    buttonEle.disabled = true;

    const tableName = buttonEle.dataset.table;

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

            buttonEle.disabled = false;
          }
        });
    };

    cityssm.confirmModal("Cleanup " + tableName,
      "Are you sure you want to permanently delete all deleted records in the " + tableName + " table?",
      "Yes, Cleanup",
      "warning",
      purgeFunction);
  };

  const purgeButtonEles = document.querySelector("#adminTabpanel--tableCleanup").querySelectorAll(".is-purge-button");

  for (const purgeButtonEle of purgeButtonEles) {
    purgeButtonEle.addEventListener("click", purgeTableFunction);
  }
})();
