"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const crmAdmin = {
        isValidRegex: (possibleRegexString) => {
            try {
                new RegExp(possibleRegexString);
                return true;
            }
            catch (_a) {
                return false;
            }
        },
        getLoadingHTML: (sectionName) => {
            return "<div class=\"has-text-centered has-text-grey-dark\">" +
                "<i class=\"fas fa-4x fa-pulse fa-spinner\" aria-hidden=\"true\"></i><br />" +
                "<em>Loading " + sectionName + "...</em>" +
                "</div>";
        }
    };
    exports.crmAdmin = crmAdmin;
    const tabEles = document.querySelector("#admin--tabs").querySelectorAll("[role='tab']");
    const tabPanelEles = document.querySelector("#admin--tabpanels").querySelectorAll("[role='tabpanel']");
    const selectTabFunction = (clickEvent) => {
        clickEvent.preventDefault();
        const selectedTabEle = clickEvent.currentTarget;
        for (const tabPanelEle of tabPanelEles) {
            tabPanelEle.classList.add("is-hidden");
        }
        for (const tabEle of tabEles) {
            tabEle.classList.remove("is-active");
            tabEle.setAttribute("aria-selected", "false");
        }
        selectedTabEle.classList.add("is-active");
        selectedTabEle.setAttribute("aria-selected", "true");
        document.querySelector("#" + selectedTabEle.getAttribute("aria-controls")).classList.remove("is-hidden");
        switch (selectedTabEle.getAttribute("aria-controls").split("--")[1]) {
            case "users":
                crmAdmin.getUsersFunction();
                break;
            case "recordTypes":
                crmAdmin.getRecordTypesFunction();
                break;
            case "statusTypes":
                crmAdmin.getRecordTypesFunction(crmAdmin.getStatusTypesFunction);
                break;
        }
    };
    for (const tabEle of tabEles) {
        tabEle.addEventListener("click", selectTabFunction);
    }
})();
