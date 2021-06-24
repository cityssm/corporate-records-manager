import type * as recordTypes from "../types/recordTypes";

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
declare const cityssm: cityssmGlobal;


(() => {
  const urlPrefix: string = exports.urlPrefix;

  const getLoadingHTML = (sectionName: string) => {

    return "<div class=\"has-text-centered has-text-grey-dark\">" +
      "<i class=\"fas fa-4x fa-pulse fa-spinner\" aria-hidden=\"true\"></i><br />" +
      "<em>Loading " + sectionName + "...</em>" +
      "</div>";
  };

  /*
   * Users
   */

  const usersContainerEle = document.getElementById("container--users");

  let users: recordTypes.User[] = [];

  const toggleUserSettingFn = (clickEvent: Event) => {

    clickEvent.preventDefault();

    const buttonEle = clickEvent.currentTarget as HTMLButtonElement;
    buttonEle.disabled = true;

    const fieldName = buttonEle.getAttribute("data-field");

    const trEle = buttonEle.closest("tr");

    const userIndex = parseInt(trEle.getAttribute("data-index"), 10);
    const user = users[userIndex];

    const newFieldValue = !user[fieldName];

    cityssm.postJSON(urlPrefix + "/admin/doSetUserSetting", {
      userName: user.userName,
      fieldName: fieldName,
      fieldValue: newFieldValue
    }, (responseJSON: { success: boolean; message?: string }) => {

      buttonEle.disabled = false;

      if (responseJSON.success) {

        user[fieldName] = newFieldValue;

        if (newFieldValue) {

          switch (fieldName) {

            case "isActive":
              buttonEle.innerHTML = "<i class=\"fas fa-user-check\" aria-label=\"Active User\"></i>";
              break;

            case "canUpdate":
              buttonEle.innerHTML = "<i class=\"fas fa-pencil-alt\" aria-label=\"Update User\"></i>";
              break;

            case "isAdmin":
              buttonEle.innerHTML = "<i class=\"fas fa-cog\" aria-label=\"Admin User\"></i>";
              break;
          }

        } else {
          buttonEle.innerHTML = "<i class=\"fas fa-minus\" aria-label=\"False\"></i>";
        }

      } else {
        cityssm.alertModal("User Setting Not Updated",
          cityssm.escapeHTML(responseJSON.message),
          "OK",
          "danger");
      }
    });
  };

  const removeUserFn = (clickEvent: Event) => {

    clickEvent.preventDefault();

    const buttonEle = clickEvent.currentTarget as HTMLButtonElement;

    const trEle = buttonEle.closest("tr");

    const userIndex = parseInt(trEle.getAttribute("data-index"), 10);
    const userName = users[userIndex].userName;

    const removeFn = () => {

      buttonEle.disabled = true;

      cityssm.postJSON(urlPrefix + "/admin/doRemoveUser", {
        userName: userName
      },
        (responseJSON: { success: boolean; message?: string }) => {

          if (responseJSON.success) {
            users.splice(userIndex, 1);
            renderUsersFn();

          } else {
            cityssm.alertModal("Error Removing User",
              cityssm.escapeHTML(responseJSON.message),
              "OK",
              "danger");

            buttonEle.disabled = false;
          }
        });
    };

    cityssm.confirmModal("Remove User?",
      "Are you sure you want to remove all access for \"" + userName + "\"?",
      "Yes, Remove User",
      "warning",
      removeFn);
  };

  const renderUsersFn = () => {

    if (users.length === 0) {
      usersContainerEle.innerHTML = "<div class=\"message is-warning\">" +
        "<p class=\"message-body\">" +
        "<strong>There are no users in the system.</strong><br />" +
        "Please create at least one user." +
        "</p>" +
        "</div>";

      return;
    }

    const tableEle = document.createElement("table");

    tableEle.className = "table is-fullwidth is-bordered is-striped is-hoverable has-sticky-header";
    tableEle.innerHTML = "<thead>" +
      "<tr>" +
      "<th>User Name</th>" +
      "<th class=\"has-text-centered\">Is Active</th>" +
      "<th class=\"has-text-centered\">Can Update</th>" +
      "<th class=\"has-text-centered\">Is Admin</th>" +
      "<th class=\"has-text-centered\">Remove</th>" +
      "</tr>" +
      "</thead>" +
      "<tbody></tbody>";

    const tbodyEle = tableEle.getElementsByTagName("tbody")[0];

    for (let index = 0; index < users.length; index += 1) {

      const user = users[index];

      const trEle = document.createElement("tr");
      trEle.setAttribute("data-index", index.toString());

      trEle.innerHTML = "<th class=\"is-vcentered\">" + user.userName + "</th>" +
        ("<td class=\"has-text-centered\">" +
          "<button class=\"button is-inverted is-info\" data-field=\"isActive\" type=\"button\">" +
          (user.isActive
            ? "<i class=\"fas fa-user-check\" aria-label=\"Active User\"></i>"
            : "<i class=\"fas fa-minus\" aria-label=\"False\"></i>") +
          "</button>" +
          "</td>") +
        ("<td class=\"has-text-centered\">" +
          "<button class=\"button is-inverted is-info\" data-field=\"canUpdate\" type=\"button\">" +
          (user.canUpdate
            ? "<i class=\"fas fa-pencil-alt\" aria-label=\"Update User\"></i>"
            : "<i class=\"fas fa-minus\" aria-label=\"False\"></i>") +
          "</button>" +
          "</td>") +
        ("<td class=\"has-text-centered\">" +
          "<button class=\"button is-inverted is-info\" data-field=\"isAdmin\" type=\"button\">" +
          (user.isAdmin
            ? "<i class=\"fas fa-cog\" aria-label=\"Admin User\"></i>"
            : "<i class=\"fas fa-minus\" aria-label=\"False\"></i>") +
          "</button>" +
          "</td>") +
        ("<td class=\"has-text-centered\">" +
          "<button class=\"button is-inverted is-danger is-remove-user-button\" type=\"button\">" +
          "<i class=\"fas fa-trash-alt\" aria-label=\"Remove User\"></i>" +
          "</button>" +
          "</td>");

      const buttonEles = trEle.getElementsByTagName("button");

      for (let buttonIndex = 0; buttonIndex < buttonEles.length; buttonIndex += 1) {

        if (buttonEles[buttonIndex].classList.contains("is-remove-user-button")) {
          buttonEles[buttonIndex].addEventListener("click", removeUserFn);

        } else {
          buttonEles[buttonIndex].addEventListener("click", toggleUserSettingFn);
        }
      }

      tbodyEle.appendChild(trEle);
    }

    cityssm.clearElement(usersContainerEle);
    usersContainerEle.appendChild(tableEle);
  };

  const getUsersFn = () => {

    users = [];

    cityssm.clearElement(usersContainerEle);
    usersContainerEle.innerHTML = getLoadingHTML("Users");

    cityssm.postJSON(urlPrefix + "/admin/doGetUsers", {},
      (responseJSON: { users: recordTypes.User[] }) => {

        users = responseJSON.users;
        renderUsersFn();
      });
  };

  document.getElementById("form--addUser").addEventListener("submit", (formEvent: Event) => {

    formEvent.preventDefault();

    const addFormEle = formEvent.currentTarget as HTMLFormElement;

    cityssm.postJSON(urlPrefix + "/admin/doAddUser", addFormEle,
      (responseJSON: { success: boolean; user?: recordTypes.User; message?: string }) => {

        if (responseJSON.success) {
          addFormEle.reset();
          users.unshift(responseJSON.user);
          renderUsersFn();
        } else {
          cityssm.alertModal("Error Creating New User",
            cityssm.escapeHTML(responseJSON.message),
            "OK",
            "danger");
        }
      });
  });

  /*
   * Record Types
   */

  const isValidRegex = (possibleRegexString: string) => {

    try {
      RegExp(possibleRegexString);
      return true;
    } catch (_e) {
      return false;
    }
  };

  const recordTypesContainerEle = document.getElementById("container--recordTypes");

  let recordTypes: recordTypes.RecordType[] = [];

  const toggleRecordTypeActiveFn = (clickEvent: Event) => {

    clickEvent.preventDefault();

    const buttonEle = clickEvent.currentTarget as HTMLButtonElement;
    buttonEle.disabled = true;

    const trEle = buttonEle.closest("tr");

    const recordTypeIndex = parseInt(trEle.getAttribute("data-index"), 10);
    const recordType = recordTypes[recordTypeIndex];

    const newIsActive = !recordType.isActive;

    cityssm.postJSON(urlPrefix + "/admin/doSetRecordTypeIsActive", {
      recordTypeKey: recordType.recordTypeKey,
      isActive: newIsActive
    }, (responseJSON: { success: boolean; message?: string }) => {

      buttonEle.disabled = false;

      if (responseJSON.success) {

        recordType.isActive = newIsActive;

        if (newIsActive) {
          buttonEle.innerHTML = "<i class=\"fas fa-check\" aria-label=\"Active Record Type\"></i>";

        } else {
          buttonEle.innerHTML = "<i class=\"fas fa-minus\" aria-label=\"False\"></i>";
        }

      } else {
        cityssm.alertModal("Record Type Not Updated",
          cityssm.escapeHTML(responseJSON.message),
          "OK",
          "danger");
      }
    });
  };

  const updateRecordTypeFn = (clickEvent: Event) => {

    clickEvent.preventDefault();

    const buttonEle = clickEvent.currentTarget as HTMLButtonElement;
    buttonEle.disabled = true;

    const trEle = buttonEle.closest("tr");

    const recordTypeIndex = parseInt(trEle.getAttribute("data-index"), 10);
    const recordType = recordTypes[recordTypeIndex];


    let formEle: HTMLFormElement;
    let patternEle: HTMLInputElement;

    let editRecordCloseModalFn: () => void;

    let isSubmitting = false;

    const submitFn = (formEvent: Event) => {

      formEvent.preventDefault();


      if (isSubmitting) {
        return;
      }

      if (!isValidRegex(patternEle.value)) {
        cityssm.alertModal("Regular Expression Pattern Invalid",
          "Please ensure you are using a valid regular expression.",
          "OK",
          "warning");
        return;
      }

      isSubmitting = true;

      cityssm.postJSON(urlPrefix + "/admin/doUpdateRecordType", formEle,
        (responseJSON: { success: boolean; message?: string; recordType?: recordTypes.RecordType }) => {

          if (responseJSON.success) {
            recordTypes[recordTypeIndex] = responseJSON.recordType;
            recordTypes[recordTypeIndex].isActive = recordType.isActive;
            recordTypes[recordTypeIndex].recordCount = recordType.recordCount;
            renderRecordTypesFn();
            editRecordCloseModalFn();
          } else {

            isSubmitting = false;

            cityssm.alertModal("Error Updating Record Type",
              cityssm.escapeHTML(responseJSON.message),
              "OK",
              "danger");
          }
        });

    };

    cityssm.openHtmlModal("recordType-edit", {

      onshow: () => {

        formEle = document.getElementById("form--editRecordType") as HTMLFormElement;

        (document.getElementById("editRecordType--recordTypeKey") as HTMLInputElement).value = recordType.recordTypeKey;
        (document.getElementById("editRecordType--recordType") as HTMLInputElement).value = recordType.recordType;
        (document.getElementById("editRecordType--minlength") as HTMLInputElement).value = recordType.minlength.toString();
        (document.getElementById("editRecordType--maxlength") as HTMLInputElement).value = recordType.maxlength.toString();

        patternEle = document.getElementById("editRecordType--pattern") as HTMLInputElement;
        patternEle.value = recordType.pattern;

        patternEle.addEventListener("keyup", () => {
          if (isValidRegex(patternEle.value)) {
            patternEle.classList.remove("is-danger");
          } else {
            patternEle.classList.add("is-danger");
          }
        });

        (document.getElementById("editRecordType--patternHelp") as HTMLInputElement).value = recordType.patternHelp;

        formEle.addEventListener("submit", submitFn);
      },
      onshown: (_modalEle, closeModalFn) => {
        editRecordCloseModalFn = closeModalFn;
      }
    });
  };

  const removeRecordTypeFn = (clickEvent: Event) => {

    clickEvent.preventDefault();

    const buttonEle = clickEvent.currentTarget as HTMLButtonElement;
    buttonEle.disabled = true;

    const trEle = buttonEle.closest("tr");

    const recordTypeIndex = parseInt(trEle.getAttribute("data-index"), 10);
    const recordType = recordTypes[recordTypeIndex];

    const removeFn = () => {
      cityssm.postJSON(urlPrefix + "/admin/doRemoveRecordType", {
        recordTypeKey: recordType.recordTypeKey
      }, (responseJSON: { success: boolean; message?: string }) => {

        if (responseJSON.success) {
          recordTypes.splice(recordTypeIndex, 1);
          renderRecordTypesFn();
        } else {
          cityssm.alertModal("Error Removing Record Type",
            cityssm.escapeHTML(responseJSON.message),
            "OK",
            "danger");
        }
      });
    };

    cityssm.confirmModal("Remove Record Type",
      "Are you sure you want to remove the \"" + cityssm.escapeHTML(recordType.recordType) + "\" record type?",
      "Yes, Remove It",
      "warning",
      removeFn);
  };

  const renderRecordTypesFn = () => {

    if (recordTypes.length === 0) {
      usersContainerEle.innerHTML = "<div class=\"message is-warning\">" +
        "<p class=\"message-body\">" +
        "<strong>There are no record types in the system.</strong><br />" +
        "Please create at least one record type." +
        "</p>" +
        "</div>";

      return;
    }

    const tableEle = document.createElement("table");

    tableEle.className = "table is-fullwidth is-bordered is-striped is-hoverable has-sticky-header";
    tableEle.innerHTML = "<thead>" +
      "<tr>" +
      "<th>Record Type</th>" +
      "<th class=\"has-text-centered\">Is Active</th>" +
      "<th class=\"has-text-centered\">Length</th>" +
      "<th class=\"has-text-centered\">Pattern</th>" +
      "<th class=\"has-text-centered\">Options</th>" +
      "</tr>" +
      "</thead>" +
      "<tbody></tbody>";

    const tbodyEle = tableEle.getElementsByTagName("tbody")[0];

    for (let index = 0; index < recordTypes.length; index += 1) {

      const recordType = recordTypes[index];

      const trEle = document.createElement("tr");
      trEle.setAttribute("data-index", index.toString());

      trEle.innerHTML = "<th class=\"is-vcentered\">" +
        recordType.recordType + "<br />" +
        "<span class=\"is-size-7\"><i class=\"fas fa-key\" aria-hidden=\"true\"></i> " + recordType.recordTypeKey + "</span>" +

        "</th>" +
        ("<td class=\"has-text-centered\">" +
          "<button class=\"button is-inverted is-info is-toggle-active-button\" type=\"button\">" +
          (recordType.isActive
            ? "<i class=\"fas fa-check\" aria-label=\"Active Record Type\"></i>"
            : "<i class=\"fas fa-minus\" aria-label=\"False\"></i>") +
          "</button>" +
          "</td>") +
        ("<td class=\"has-text-centered\">" +
          recordType.minlength.toString() + " - " + recordType.maxlength.toString() +
          "</td>") +
        ("<td class=\"has-text-centered\">" +
          cityssm.escapeHTML(recordType.pattern) + "<br />" +
          "<span class=\"is-size-7\">" + cityssm.escapeHTML(recordType.patternHelp) + "</span>" +
          "</td>") +
        ("<td class=\"has-text-centered\">" +
          "<button class=\"button is-inverted is-info is-update-button\" type=\"button\">" +
          "<i class=\"fas fa-pencil-alt\" aria-label=\"Update Record Type\"></i>" +
          "</button>" +
          (recordType.recordCount === 0
            ? " <button class=\"button is-inverted is-danger is-remove-button\" type=\"button\">" +
            "<i class=\"fas fa-trash-alt\" aria-label=\"Remove Record Type\"></i>" +
            "</button>"
            : "") +
          "</td>");

      trEle.getElementsByClassName("is-toggle-active-button")[0].addEventListener("click", toggleRecordTypeActiveFn);
      trEle.getElementsByClassName("is-update-button")[0].addEventListener("click", updateRecordTypeFn);

      if (recordType.recordCount === 0) {
        trEle.getElementsByClassName("is-remove-button")[0].addEventListener("click", removeRecordTypeFn);
      }

      tbodyEle.appendChild(trEle);
    }

    cityssm.clearElement(recordTypesContainerEle);
    recordTypesContainerEle.appendChild(tableEle);
  };

  const getRecordTypesFn = () => {

    recordTypes = [];

    cityssm.clearElement(recordTypesContainerEle);
    recordTypesContainerEle.innerHTML = getLoadingHTML("Record Types");

    cityssm.postJSON(urlPrefix + "/admin/doGetRecordTypes", {},
      (responseJSON: { recordTypes: recordTypes.RecordType[] }) => {

        recordTypes = responseJSON.recordTypes;
        renderRecordTypesFn();
      });
  };

  document.getElementById("is-add-record-type-button").addEventListener("click", () => {

    let formEle: HTMLFormElement;
    let patternEle: HTMLInputElement;

    let addRecordCloseModalFn: () => void;

    let isSubmitting = false;

    const submitFn = (formEvent: Event) => {

      formEvent.preventDefault();

      if (isSubmitting) {
        return;
      }

      if (!isValidRegex(patternEle.value)) {
        cityssm.alertModal("Regular Expression Pattern Invalid",
          "Please ensure you are using a valid regular expression.",
          "OK",
          "warning");
        return;
      }

      isSubmitting = true;

      cityssm.postJSON(urlPrefix + "/admin/doAddRecordType", formEle,
        (responseJSON: { success: boolean; message?: string; recordType?: recordTypes.RecordType }) => {

          if (responseJSON.success) {
            recordTypes.unshift(responseJSON.recordType);
            renderRecordTypesFn();
            addRecordCloseModalFn();
          } else {

            isSubmitting = false;

            cityssm.alertModal("Error Adding Record Type",
              cityssm.escapeHTML(responseJSON.message),
              "OK",
              "danger");
          }
        });
    };

    cityssm.openHtmlModal("recordType-add", {

      onshow: () => {

        formEle = document.getElementById("form--addRecordType") as HTMLFormElement;
        patternEle = document.getElementById("addRecordType--pattern") as HTMLInputElement;

        patternEle.addEventListener("keyup", () => {
          if (isValidRegex(patternEle.value)) {
            patternEle.classList.remove("is-danger");
          } else {
            patternEle.classList.add("is-danger");
          }
        });

        formEle.addEventListener("submit", submitFn);
      },
      onshown: (_modalEle, closeModalFn) => {
        addRecordCloseModalFn = closeModalFn;
      }
    });
  });

  /*
   * Status Types
   */

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
        getUsersFn();
        break;

      case "recordTypes":
        getRecordTypesFn();
        break;

      case "statusTypes":
        break;
    }
  };

  tabEles.forEach((tabEle) => {
    tabEle.addEventListener("click", selectTabFn);
  });
})();
