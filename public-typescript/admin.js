"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(function () {
    var urlPrefix = exports.urlPrefix;
    var getLoadingHTML = function (sectionName) {
        return "<div class=\"has-text-centered has-text-grey-dark\">" +
            "<i class=\"fas fa-4x fa-pulse fa-spinner\" aria-hidden=\"true\"></i><br />" +
            "<em>Loading " + sectionName + "...</em>" +
            "</div>";
    };
    var usersContainerEle = document.getElementById("container--users");
    var users = [];
    var toggleUserSettingFn = function (clickEvent) {
        clickEvent.preventDefault();
        var buttonEle = clickEvent.currentTarget;
        buttonEle.disabled = true;
        var fieldName = buttonEle.getAttribute("data-field");
        var trEle = buttonEle.closest("tr");
        var userIndex = parseInt(trEle.getAttribute("data-index"), 10);
        var user = users[userIndex];
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
        clickEvent.preventDefault();
        var buttonEle = clickEvent.currentTarget;
        var trEle = buttonEle.closest("tr");
        var userIndex = parseInt(trEle.getAttribute("data-index"), 10);
        var userName = users[userIndex].userName;
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
                    "<button class=\"button is-inverted is-danger is-remove-user-button\" type=\"button\">" +
                    "<i class=\"fas fa-trash-alt\" aria-label=\"Remove User\"></i>" +
                    "</button>" +
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
    var getUsersFn = function () {
        users = [];
        cityssm.clearElement(usersContainerEle);
        usersContainerEle.innerHTML = getLoadingHTML("Users");
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
                getUsersFn();
                break;
            case "recordTypes":
                break;
            case "statusTypes":
                break;
        }
    };
    tabEles.forEach(function (tabEle) {
        tabEle.addEventListener("click", selectTabFn);
    });
})();
