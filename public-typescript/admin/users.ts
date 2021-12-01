/* eslint-disable unicorn/prefer-module */

import type * as recordTypes from "../../types/recordTypes";
import type { CRMAdmin } from "./main.js";

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
declare const cityssm: cityssmGlobal;


(() => {

  const crmAdmin: CRMAdmin = exports.crmAdmin;
  const urlPrefix: string = exports.urlPrefix;

  /*
   * Users
   */

  const usersContainerElement = document.querySelector("#container--users") as HTMLElement;

  let users: recordTypes.User[] = [];

  const getUserFromEventFunction = (clickEvent: Event) => {

    const buttonElement = clickEvent.currentTarget as HTMLButtonElement;

    const trElement = buttonElement.closest("tr");

    const userIndex = Number.parseInt(trElement.dataset.index, 10);
    const user = users[userIndex];

    return {
      buttonElement,
      trElement,
      userIndex,
      user
    };
  };

  const toggleUserSettingFunction = (clickEvent: Event) => {

    const { buttonElement, user } = getUserFromEventFunction(clickEvent);

    buttonElement.disabled = true;

    const fieldName = buttonElement.dataset.field;

    const newFieldValue = !user[fieldName];

    cityssm.postJSON(urlPrefix + "/admin/doSetUserSetting", {
      userName: user.userName,
      fieldName: fieldName,
      fieldValue: newFieldValue
    }, (responseJSON: { success: boolean; message?: string }) => {

      buttonElement.disabled = false;

      if (responseJSON.success) {

        user[fieldName] = newFieldValue;

        if (newFieldValue) {

          switch (fieldName) {

            case "isActive":
              buttonElement.innerHTML = "<i class=\"fas fa-user-check\" aria-label=\"Active User\"></i>";
              break;

            case "canUpdate":
              buttonElement.innerHTML = "<i class=\"fas fa-pencil-alt\" aria-label=\"Update User\"></i>";
              break;

            case "isAdmin":
              buttonElement.innerHTML = "<i class=\"fas fa-cog\" aria-label=\"Admin User\"></i>";
              break;
          }

        } else {
          buttonElement.innerHTML = "<i class=\"fas fa-minus\" aria-label=\"False\"></i>";
        }

      } else {
        cityssm.alertModal("User Setting Not Updated",
          cityssm.escapeHTML(responseJSON.message),
          "OK",
          "danger");
      }
    });
  };

  const removeUserFunction = (clickEvent: Event) => {

    const { buttonElement, user, userIndex } = getUserFromEventFunction(clickEvent);

    const userName = user.userName;

    const removeFunction = () => {

      buttonElement.disabled = true;

      cityssm.postJSON(urlPrefix + "/admin/doRemoveUser", {
        userName: userName
      },
        (responseJSON: { success: boolean; message?: string }) => {

          if (responseJSON.success) {
            users.splice(userIndex, 1);
            renderUsersFunction();

          } else {
            cityssm.alertModal("Error Removing User",
              cityssm.escapeHTML(responseJSON.message),
              "OK",
              "danger");

            buttonElement.disabled = false;
          }
        });
    };

    cityssm.confirmModal("Remove User?",
      "Are you sure you want to remove all access for \"" + userName + "\"?",
      "Yes, Remove User",
      "warning",
      removeFunction);
  };

  const renderUsersFunction = () => {

    if (users.length === 0) {
      usersContainerElement.innerHTML = "<div class=\"message is-warning\">" +
        "<p class=\"message-body\">" +
        "<strong>There are no users in the system.</strong><br />" +
        "Please create at least one user." +
        "</p>" +
        "</div>";

      return;
    }

    const tableElement = document.createElement("table");

    tableElement.className = "table is-fullwidth is-bordered is-striped is-hoverable has-sticky-header";
    tableElement.innerHTML = "<thead>" +
      "<tr>" +
      "<th>User Name</th>" +
      "<th class=\"has-text-centered\">Is Active</th>" +
      "<th class=\"has-text-centered\">Can Update</th>" +
      "<th class=\"has-text-centered\">Is Admin</th>" +
      "<th class=\"has-text-centered\">Remove</th>" +
      "</tr>" +
      "</thead>" +
      "<tbody></tbody>";

    const tbodyElement = tableElement.querySelectorAll("tbody")[0];

    for (const [index, user] of users.entries()) {

      const trElement = document.createElement("tr");
      trElement.dataset.index = index.toString();

      trElement.innerHTML = "<th class=\"is-vcentered\">" + user.userName + "</th>" +
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
          (exports.user.userName === user.userName
            ? ""
            : "<button class=\"button is-inverted is-danger is-remove-user-button\" type=\"button\">" +
            "<i class=\"fas fa-trash-alt\" aria-label=\"Remove User\"></i>" +
            "</button>") +
          "</td>");

      const buttonElements = trElement.querySelectorAll("button");

      for (const buttonElement of buttonElements) {

        if (buttonElement.classList.contains("is-remove-user-button")) {
          buttonElement.addEventListener("click", removeUserFunction);

        } else {
          buttonElement.addEventListener("click", toggleUserSettingFunction);
        }
      }

      tbodyElement.append(trElement);
    }

    cityssm.clearElement(usersContainerElement);
    usersContainerElement.append(tableElement);
  };

  crmAdmin.getUsersFunction = () => {

    users = [];

    cityssm.clearElement(usersContainerElement);
    usersContainerElement.innerHTML = crmAdmin.getLoadingHTML("Users");

    cityssm.postJSON(urlPrefix + "/admin/doGetUsers", {},
      (responseJSON: { users: recordTypes.User[] }) => {

        users = responseJSON.users;
        renderUsersFunction();
      });
  };

  document.querySelector("#form--addUser").addEventListener("submit", (formEvent: Event) => {

    formEvent.preventDefault();

    const addFormElement = formEvent.currentTarget as HTMLFormElement;

    cityssm.postJSON(urlPrefix + "/admin/doAddUser", addFormElement,
      (responseJSON: { success: boolean; user?: recordTypes.User; message?: string }) => {

        if (responseJSON.success) {
          addFormElement.reset();
          users.unshift(responseJSON.user);
          renderUsersFunction();
        } else {
          cityssm.alertModal("Error Creating New User",
            cityssm.escapeHTML(responseJSON.message),
            "OK",
            "danger");
        }
      });
  });

})();
