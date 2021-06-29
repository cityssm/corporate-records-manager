"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const crmAdmin = exports.crmAdmin;
    const urlPrefix = exports.urlPrefix;
    const usersContainerEle = document.querySelector("#container--users");
    let users = [];
    const getUserFromEventFunction = (clickEvent) => {
        const buttonEle = clickEvent.currentTarget;
        const trEle = buttonEle.closest("tr");
        const userIndex = Number.parseInt(trEle.getAttribute("data-index"), 10);
        const user = users[userIndex];
        return {
            buttonEle,
            trEle,
            userIndex,
            user
        };
    };
    const toggleUserSettingFunction = (clickEvent) => {
        const { buttonEle, user } = getUserFromEventFunction(clickEvent);
        buttonEle.disabled = true;
        const fieldName = buttonEle.dataset.field;
        const newFieldValue = !user[fieldName];
        cityssm.postJSON(urlPrefix + "/admin/doSetUserSetting", {
            userName: user.userName,
            fieldName: fieldName,
            fieldValue: newFieldValue
        }, (responseJSON) => {
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
                }
                else {
                    buttonEle.innerHTML = "<i class=\"fas fa-minus\" aria-label=\"False\"></i>";
                }
            }
            else {
                cityssm.alertModal("User Setting Not Updated", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
            }
        });
    };
    const removeUserFunction = (clickEvent) => {
        const { buttonEle, user, userIndex } = getUserFromEventFunction(clickEvent);
        const userName = user.userName;
        const removeFunction = () => {
            buttonEle.disabled = true;
            cityssm.postJSON(urlPrefix + "/admin/doRemoveUser", {
                userName: userName
            }, (responseJSON) => {
                if (responseJSON.success) {
                    users.splice(userIndex, 1);
                    renderUsersFunction();
                }
                else {
                    cityssm.alertModal("Error Removing User", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                    buttonEle.disabled = false;
                }
            });
        };
        cityssm.confirmModal("Remove User?", "Are you sure you want to remove all access for \"" + userName + "\"?", "Yes, Remove User", "warning", removeFunction);
    };
    const renderUsersFunction = () => {
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
        const tbodyEle = tableEle.querySelectorAll("tbody")[0];
        for (const [index, user] of users.entries()) {
            const trEle = document.createElement("tr");
            trEle.dataset.index = index.toString();
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
                    (exports.user.userName === user.userName
                        ? ""
                        : "<button class=\"button is-inverted is-danger is-remove-user-button\" type=\"button\">" +
                            "<i class=\"fas fa-trash-alt\" aria-label=\"Remove User\"></i>" +
                            "</button>") +
                    "</td>");
            const buttonEles = trEle.querySelectorAll("button");
            for (const buttonEle of buttonEles) {
                if (buttonEle.classList.contains("is-remove-user-button")) {
                    buttonEle.addEventListener("click", removeUserFunction);
                }
                else {
                    buttonEle.addEventListener("click", toggleUserSettingFunction);
                }
            }
            tbodyEle.append(trEle);
        }
        cityssm.clearElement(usersContainerEle);
        usersContainerEle.append(tableEle);
    };
    crmAdmin.getUsersFunction = () => {
        users = [];
        cityssm.clearElement(usersContainerEle);
        usersContainerEle.innerHTML = crmAdmin.getLoadingHTML("Users");
        cityssm.postJSON(urlPrefix + "/admin/doGetUsers", {}, (responseJSON) => {
            users = responseJSON.users;
            renderUsersFunction();
        });
    };
    document.querySelector("#form--addUser").addEventListener("submit", (formEvent) => {
        formEvent.preventDefault();
        const addFormEle = formEvent.currentTarget;
        cityssm.postJSON(urlPrefix + "/admin/doAddUser", addFormEle, (responseJSON) => {
            if (responseJSON.success) {
                addFormEle.reset();
                users.unshift(responseJSON.user);
                renderUsersFunction();
            }
            else {
                cityssm.alertModal("Error Creating New User", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
            }
        });
    });
})();
