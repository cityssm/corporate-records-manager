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
        break;

      case "statusTypes":
        break;
    }
  };

  tabEles.forEach((tabEle) => {
    tabEle.addEventListener("click", selectTabFn);
  });
})();
