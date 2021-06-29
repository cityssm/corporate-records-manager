"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const urlPrefix = exports.urlPrefix;
    const purgeTableFunction = (clickEvent) => {
        const buttonEle = clickEvent.currentTarget;
        buttonEle.disabled = true;
        const tableName = buttonEle.dataset.table;
        const purgeFunction = () => {
            cityssm.postJSON(urlPrefix + "/admin/doTableCleanup", {
                tableName
            }, (responseJSON) => {
                if (responseJSON.success) {
                    cityssm.alertModal("Table Cleaned Successfully", responseJSON.recordCount.toString() + " row" + (responseJSON.recordCount === 1 ? "" : "s") + " deleted.", "OK", "success");
                }
                else {
                    cityssm.alertModal("Error Cleaning Table", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                    buttonEle.disabled = false;
                }
            });
        };
        cityssm.confirmModal("Cleanup " + tableName, "Are you sure you want to permanently delete all deleted records in the " + tableName + " table?", "Yes, Cleanup", "warning", purgeFunction);
    };
    const purgeButtonEles = document.querySelector("#adminTabpanel--tableCleanup").querySelectorAll(".is-purge-button");
    for (const purgeButtonEle of purgeButtonEles) {
        purgeButtonEle.addEventListener("click", purgeTableFunction);
    }
})();
