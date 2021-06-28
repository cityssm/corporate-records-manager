"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
(function () {
    var urlPrefix = exports.urlPrefix;
    var recordID = document.getElementById("record--recordID").value;
    document.getElementById("is-remove-record-button").addEventListener("click", function (clickEvent) {
        clickEvent.preventDefault();
        var removeFn = function () {
            cityssm.postJSON(urlPrefix + "/edit/doRemove", {
                recordID: recordID
            }, function (responseJSON) {
                if (responseJSON.success) {
                    window.location.href = urlPrefix + "/dashboard";
                }
                else {
                    cityssm.alertModal("Record Remove Error", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                }
            });
        };
        cityssm.confirmModal("Remove Record?", "Are you sure you want to remove this record?", "Yes, Remove the Record", "warning", removeFn);
    });
    var crmEdit = {
        recordID: recordID,
        clearPanelBlocksFn: function (panelEle) {
            var panelBlockEles = panelEle.getElementsByClassName("panel-block");
            for (var index = 0; index < panelBlockEles.length; index += 1) {
                panelBlockEles[index].remove();
                index -= 1;
            }
        }
    };
    exports.crmEdit = crmEdit;
})();
