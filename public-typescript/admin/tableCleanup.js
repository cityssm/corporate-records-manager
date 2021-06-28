"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(function () {
    var urlPrefix = exports.urlPrefix;
    var purgeTableFn = function (clickEvent) {
        var buttonEle = clickEvent.currentTarget;
        buttonEle.disabled = true;
        var tableName = buttonEle.getAttribute("data-table");
        var purgeFn = function () {
            cityssm.postJSON(urlPrefix + "/admin/doTableCleanup", {
                tableName: tableName
            }, function (responseJSON) {
                if (responseJSON.success) {
                    cityssm.alertModal("Table Cleaned Successfully", responseJSON.recordCount.toString() + " row" + (responseJSON.recordCount === 1 ? "" : "s") + " deleted.", "OK", "success");
                }
                else {
                    cityssm.alertModal("Error Cleaning Table", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                    buttonEle.disabled = false;
                }
            });
        };
        cityssm.confirmModal("Cleanup " + tableName, "Are you sure you want to permanently delete all deleted records in the " + tableName + " table?", "Yes, Cleanup", "warning", purgeFn);
    };
    var purgeButtonEles = document.getElementById("adminTabpanel--tableCleanup").getElementsByClassName("is-purge-button");
    for (var buttonIndex = 0; buttonIndex < purgeButtonEles.length; buttonIndex += 1) {
        purgeButtonEles[buttonIndex].addEventListener("click", purgeTableFn);
    }
})();
