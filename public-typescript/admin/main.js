"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
(function () {
    var crmAdmin = {
        isValidRegex: function (possibleRegexString) {
            try {
                RegExp(possibleRegexString);
                return true;
            }
            catch (_e) {
                return false;
            }
        },
        getLoadingHTML: function (sectionName) {
            return "<div class=\"has-text-centered has-text-grey-dark\">" +
                "<i class=\"fas fa-4x fa-pulse fa-spinner\" aria-hidden=\"true\"></i><br />" +
                "<em>Loading " + sectionName + "...</em>" +
                "</div>";
        }
    };
    exports.crmAdmin = crmAdmin;
    var tabEles = document.getElementById("admin--tabs").querySelectorAll("[role='tab']");
    var tabPanelEles = document.getElementById("admin--tabpanels").querySelectorAll("[role='tabpanel']");
    var selectTabFn = function (clickEvent) {
        clickEvent.preventDefault();
        var selectedTabEle = clickEvent.currentTarget;
        tabPanelEles.forEach(function (tabPanelEle) {
            tabPanelEle.classList.add("is-hidden");
        });
        tabEles.forEach(function (tabEle) {
            tabEle.classList.remove("is-active");
            tabEle.setAttribute("aria-selected", "false");
        });
        selectedTabEle.classList.add("is-active");
        selectedTabEle.setAttribute("aria-selected", "true");
        document.getElementById(selectedTabEle.getAttribute("aria-controls")).classList.remove("is-hidden");
        switch (selectedTabEle.getAttribute("aria-controls").split("--")[1]) {
            case "users":
                crmAdmin.getUsersFn();
                break;
            case "recordTypes":
                crmAdmin.getRecordTypesFn();
                break;
            case "statusTypes":
                crmAdmin.getRecordTypesFn(crmAdmin.getStatusTypesFn);
                break;
        }
    };
    tabEles.forEach(function (tabEle) {
        tabEle.addEventListener("click", selectTabFn);
    });
})();
