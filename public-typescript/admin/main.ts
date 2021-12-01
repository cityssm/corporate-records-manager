/* eslint-disable unicorn/prefer-module */

import type * as recordTypes from "../../types/recordTypes";


export interface CRMAdmin {
  getLoadingHTML: (sectionName: string) => string;
  isValidRegex: (possibleRegexString: string) => boolean;

  recordTypes?: recordTypes.RecordType[];

  getUsersFunction?: () => void;
  getRecordTypesFunction?: (callbackFunction?: () => void) => void;
  getStatusTypesFunction?: () => void;
}


(() => {

  /*
   * Set up Global
   */

  const crmAdmin: CRMAdmin = {

    isValidRegex: (possibleRegexString) => {
      try {
        new RegExp(possibleRegexString);
        return true;
      } catch {
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

  const tabElements = document.querySelector("#admin--tabs").querySelectorAll("[role='tab']");
  const tabPanelElements = document.querySelector("#admin--tabpanels").querySelectorAll("[role='tabpanel']");

  const selectTabFunction = (clickEvent: Event) => {

    clickEvent.preventDefault();

    const selectedTabElement = clickEvent.currentTarget as HTMLElement;

    // Hide all tabpanels
    for (const tabPanelElement of tabPanelElements) {
      tabPanelElement.classList.add("is-hidden");
    }

    // Deactivate all tabs
    for (const tabElement of tabElements) {
      tabElement.classList.remove("is-active");
      tabElement.setAttribute("aria-selected", "false");
    }

    // Select tab
    selectedTabElement.classList.add("is-active");
    selectedTabElement.setAttribute("aria-selected", "true");

    // Display tabpanel
    document.querySelector("#" + selectedTabElement.getAttribute("aria-controls")).classList.remove("is-hidden");

    // Load the tabpanel content
    switch (selectedTabElement.getAttribute("aria-controls").split("--")[1]) {

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

  for (const tabElement of tabElements) {
    tabElement.addEventListener("click", selectTabFunction);
  }
})();
