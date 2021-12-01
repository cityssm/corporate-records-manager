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
    const tabElements = document.querySelector("#admin--tabs").querySelectorAll("[role='tab']");
    const tabPanelElements = document.querySelector("#admin--tabpanels").querySelectorAll("[role='tabpanel']");
    const selectTabFunction = (clickEvent) => {
        clickEvent.preventDefault();
        const selectedTabElement = clickEvent.currentTarget;
        for (const tabPanelElement of tabPanelElements) {
            tabPanelElement.classList.add("is-hidden");
        }
        for (const tabElement of tabElements) {
            tabElement.classList.remove("is-active");
            tabElement.setAttribute("aria-selected", "false");
        }
        selectedTabElement.classList.add("is-active");
        selectedTabElement.setAttribute("aria-selected", "true");
        document.querySelector("#" + selectedTabElement.getAttribute("aria-controls")).classList.remove("is-hidden");
        switch (selectedTabElement.getAttribute("aria-controls").split("--")[1]) {
            case "users":
                crmAdmin.getUsersFunction();
                break;
            case "recordTypes":
                crmAdmin.getRecordTypesFunction();
                break;
            case "recordUserTypes":
                crmAdmin.getRecordUserTypesFunction();
                break;
            case "statusTypes":
                crmAdmin.getRecordTypesFunction(crmAdmin.getStatusTypesFunction);
                break;
        }
    };
    for (const tabElement of tabElements) {
        tabElement.addEventListener("click", selectTabFunction);
    }
})();
