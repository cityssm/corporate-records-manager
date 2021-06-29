"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const urlPrefix = exports.urlPrefix;
    const recordID = document.querySelector("#record--recordID").value;
    document.querySelector("#is-remove-record-button").addEventListener("click", (clickEvent) => {
        clickEvent.preventDefault();
        const removeFunction = () => {
            cityssm.postJSON(urlPrefix + "/edit/doRemove", {
                recordID: recordID
            }, (responseJSON) => {
                if (responseJSON.success) {
                    window.location.href = urlPrefix + "/dashboard";
                }
                else {
                    cityssm.alertModal("Record Remove Error", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                }
            });
        };
        cityssm.confirmModal("Remove Record?", "Are you sure you want to remove this record?", "Yes, Remove the Record", "warning", removeFunction);
    });
    const crmEdit = {
        recordID,
        getLoadingPanelBlockHTML: (sectionName) => {
            return "<div class=\"panel-block is-block has-text-centered has-text-grey\">" +
                "<i class=\"fas fa-4x fa-spinner fa-pulse\" aria-hidden=\"true\"></i><br />" +
                "Loading " + sectionName + "..." +
                "</div>";
        },
        clearPanelBlocksFunction: (panelEle) => {
            const panelBlockEles = panelEle.querySelectorAll(".panel-block");
            for (let index = 0; index < panelBlockEles.length; index += 1) {
                panelBlockEles[index].remove();
                index -= 1;
            }
        }
    };
    exports.crmEdit = crmEdit;
})();
