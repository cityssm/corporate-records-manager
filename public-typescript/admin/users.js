"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(function () {
    var crmAdmin = exports.crmAdmin;
    var urlPrefix = exports.urlPrefix;
    var usersContainerEle = document.getElementById("container--users");
    var users = [];
    var getUserFromEventFn = function (clickEvent) {
        var buttonEle = clickEvent.currentTarget;
        var trEle = buttonEle.closest("tr");
        var userIndex = parseInt(trEle.getAttribute("data-index"), 10);
        var user = users[userIndex];
        return {
            buttonEle: buttonEle,
            trEle: trEle,
            userIndex: userIndex,
            user: user
        };
    };
    var toggleUserSettingFn = function (clickEvent) {
        var _a = getUserFromEventFn(clickEvent), buttonEle = _a.buttonEle, user = _a.user;
        buttonEle.disabled = true;
        var fieldName = buttonEle.getAttribute("data-field");
        var newFieldValue = !user[fieldName];
        cityssm.postJSON(urlPrefix + "/admin/doSetUserSetting", {
            userName: user.userName,
            fieldName: fieldName,
            fieldValue: newFieldValue
        }, function (responseJSON) {
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
    var removeUserFn = function (clickEvent) {
        var _a = getUserFromEventFn(clickEvent), buttonEle = _a.buttonEle, user = _a.user, userIndex = _a.userIndex;
        var userName = user.userName;
        var removeFn = function () {
            buttonEle.disabled = true;
            cityssm.postJSON(urlPrefix + "/admin/doRemoveUser", {
                userName: userName
            }, function (responseJSON) {
                if (responseJSON.success) {
                    users.splice(userIndex, 1);
                    renderUsersFn();
                }
                else {
                    cityssm.alertModal("Error Removing User", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                    buttonEle.disabled = false;
                }
            });
        };
        cityssm.confirmModal("Remove User?", "Are you sure you want to remove all access for \"" + userName + "\"?", "Yes, Remove User", "warning", removeFn);
    };
    var renderUsersFn = function () {
        if (users.length === 0) {
            usersContainerEle.innerHTML = "<div class=\"message is-warning\">" +
                "<p class=\"message-body\">" +
                "<strong>There are no users in the system.</strong><br />" +
                "Please create at least one user." +
                "</p>" +
                "</div>";
            return;
        }
        var tableEle = document.createElement("table");
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
        var tbodyEle = tableEle.getElementsByTagName("tbody")[0];
        for (var index = 0; index < users.length; index += 1) {
            var user = users[index];
            var trEle = document.createElement("tr");
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
                    (exports.user.userName === user.userName
                        ? ""
                        : "<button class=\"button is-inverted is-danger is-remove-user-button\" type=\"button\">" +
                            "<i class=\"fas fa-trash-alt\" aria-label=\"Remove User\"></i>" +
                            "</button>") +
                    "</td>");
            var buttonEles = trEle.getElementsByTagName("button");
            for (var buttonIndex = 0; buttonIndex < buttonEles.length; buttonIndex += 1) {
                if (buttonEles[buttonIndex].classList.contains("is-remove-user-button")) {
                    buttonEles[buttonIndex].addEventListener("click", removeUserFn);
                }
                else {
                    buttonEles[buttonIndex].addEventListener("click", toggleUserSettingFn);
                }
            }
            tbodyEle.appendChild(trEle);
        }
        cityssm.clearElement(usersContainerEle);
        usersContainerEle.appendChild(tableEle);
    };
    crmAdmin.getUsersFn = function () {
        users = [];
        cityssm.clearElement(usersContainerEle);
        usersContainerEle.innerHTML = crmAdmin.getLoadingHTML("Users");
        cityssm.postJSON(urlPrefix + "/admin/doGetUsers", {}, function (responseJSON) {
            users = responseJSON.users;
            renderUsersFn();
        });
    };
    document.getElementById("form--addUser").addEventListener("submit", function (formEvent) {
        formEvent.preventDefault();
        var addFormEle = formEvent.currentTarget;
        cityssm.postJSON(urlPrefix + "/admin/doAddUser", addFormEle, function (responseJSON) {
            if (responseJSON.success) {
                addFormEle.reset();
                users.unshift(responseJSON.user);
                renderUsersFn();
            }
            else {
                cityssm.alertModal("Error Creating New User", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
            }
        });
    });
})();
