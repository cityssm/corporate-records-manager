import type * as recordTypes from "../../types/recordTypes";


export interface CRMAdmin {
  getLoadingHTML: (sectionName: string) => string;
  isValidRegex: (possibleRegexString: string) => boolean;

  recordTypes?: recordTypes.RecordType[];

  getUsersFn?: () => void;
  getRecordTypesFn?: (callbackFn?: () => void) => void;
  getStatusTypesFn?: () => void;
};


(() => {

  /*
   * Set up Global
   */

  const crmAdmin: CRMAdmin = {

    isValidRegex: (possibleRegexString) => {
      try {
        RegExp(possibleRegexString);
        return true;
      } catch (_e) {
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

  /*
   * Tabs
   */

  const tabEles = document.getElementById("admin--tabs").querySelectorAll("[role='tab']");
  const tabPanelEles = document.getElementById("admin--tabpanels").querySelectorAll("[role='tabpanel']");

  const selectTabFn = (clickEvent: Event) => {

    clickEvent.preventDefault();

    const selectedTabEle = clickEvent.currentTarget as HTMLElement;

    // Hide all tabpanels
    tabPanelEles.forEach((tabPanelEle) => {
      tabPanelEle.classList.add("is-hidden");
    });

    // Deactivate all tabs
    tabEles.forEach((tabEle) => {
      tabEle.classList.remove("is-active");
      tabEle.setAttribute("aria-selected", "false");
    });

    // Select tab
    selectedTabEle.classList.add("is-active");
    selectedTabEle.setAttribute("aria-selected", "true");

    // Display tabpanel
    document.getElementById(selectedTabEle.getAttribute("aria-controls")).classList.remove("is-hidden");

    // Load the tabpanel content
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

  tabEles.forEach((tabEle) => {
    tabEle.addEventListener("click", selectTabFn);
  });
})();
