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
    var isValidRegex = function (possibleRegexString) {
        try {
            RegExp(possibleRegexString);
            return true;
        }
        catch (_e) {
            return false;
        }
    };
    var recordTypesContainerEle = document.getElementById("container--recordTypes");
    var recordTypes = [];
    var toggleRecordTypeActiveFn = function (clickEvent) {
        clickEvent.preventDefault();
        var buttonEle = clickEvent.currentTarget;
        buttonEle.disabled = true;
        var trEle = buttonEle.closest("tr");
        var recordTypeIndex = parseInt(trEle.getAttribute("data-index"), 10);
        var recordType = recordTypes[recordTypeIndex];
        var newIsActive = !recordType.isActive;
        cityssm.postJSON(urlPrefix + "/admin/doSetRecordTypeIsActive", {
            recordTypeKey: recordType.recordTypeKey,
            isActive: newIsActive
        }, function (responseJSON) {
            buttonEle.disabled = false;
            if (responseJSON.success) {
                recordType.isActive = newIsActive;
                if (newIsActive) {
                    buttonEle.innerHTML = "<i class=\"fas fa-check\" aria-label=\"Active Record Type\"></i>";
                }
                else {
                    buttonEle.innerHTML = "<i class=\"fas fa-minus\" aria-label=\"False\"></i>";
                }
            }
            else {
                cityssm.alertModal("Record Type Not Updated", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
            }
        });
    };
    var updateRecordTypeFn = function (clickEvent) {
        clickEvent.preventDefault();
        var buttonEle = clickEvent.currentTarget;
        buttonEle.disabled = true;
        var trEle = buttonEle.closest("tr");
        var recordTypeIndex = parseInt(trEle.getAttribute("data-index"), 10);
        var recordType = recordTypes[recordTypeIndex];
        var formEle;
        var patternEle;
        var editRecordCloseModalFn;
        var isSubmitting = false;
        var submitFn = function (formEvent) {
            formEvent.preventDefault();
            if (isSubmitting) {
                return;
            }
            if (!isValidRegex(patternEle.value)) {
                cityssm.alertModal("Regular Expression Pattern Invalid", "Please ensure you are using a valid regular expression.", "OK", "warning");
                return;
            }
            isSubmitting = true;
            cityssm.postJSON(urlPrefix + "/admin/doUpdateRecordType", formEle, function (responseJSON) {
                if (responseJSON.success) {
                    recordTypes[recordTypeIndex] = responseJSON.recordType;
                    recordTypes[recordTypeIndex].isActive = recordType.isActive;
                    recordTypes[recordTypeIndex].recordCount = recordType.recordCount;
                    renderRecordTypesFn();
                    editRecordCloseModalFn();
                }
                else {
                    isSubmitting = false;
                    cityssm.alertModal("Error Updating Record Type", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                }
            });
        };
        cityssm.openHtmlModal("recordType-edit", {
            onshow: function () {
                formEle = document.getElementById("form--editRecordType");
                document.getElementById("editRecordType--recordTypeKey").value = recordType.recordTypeKey;
                document.getElementById("editRecordType--recordType").value = recordType.recordType;
                document.getElementById("editRecordType--minlength").value = recordType.minlength.toString();
                document.getElementById("editRecordType--maxlength").value = recordType.maxlength.toString();
                patternEle = document.getElementById("editRecordType--pattern");
                patternEle.value = recordType.pattern;
                patternEle.addEventListener("keyup", function () {
                    if (isValidRegex(patternEle.value)) {
                        patternEle.classList.remove("is-danger");
                    }
                    else {
                        patternEle.classList.add("is-danger");
                    }
                });
                document.getElementById("editRecordType--patternHelp").value = recordType.patternHelp;
                formEle.addEventListener("submit", submitFn);
            },
            onshown: function (_modalEle, closeModalFn) {
                editRecordCloseModalFn = closeModalFn;
            }
        });
    };
    var removeRecordTypeFn = function (clickEvent) {
        clickEvent.preventDefault();
        var buttonEle = clickEvent.currentTarget;
        buttonEle.disabled = true;
        var trEle = buttonEle.closest("tr");
        var recordTypeIndex = parseInt(trEle.getAttribute("data-index"), 10);
        var recordType = recordTypes[recordTypeIndex];
        var removeFn = function () {
            cityssm.postJSON(urlPrefix + "/admin/doRemoveRecordType", {
                recordTypeKey: recordType.recordTypeKey
            }, function (responseJSON) {
                if (responseJSON.success) {
                    recordTypes.splice(recordTypeIndex, 1);
                    renderRecordTypesFn();
                }
                else {
                    cityssm.alertModal("Error Removing Record Type", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                }
            });
        };
        cityssm.confirmModal("Remove Record Type", "Are you sure you want to remove the \"" + cityssm.escapeHTML(recordType.recordType) + "\" record type?", "Yes, Remove It", "warning", removeFn);
    };
    var renderRecordTypesFn = function () {
        if (recordTypes.length === 0) {
            usersContainerEle.innerHTML = "<div class=\"message is-warning\">" +
                "<p class=\"message-body\">" +
                "<strong>There are no record types in the system.</strong><br />" +
                "Please create at least one record type." +
                "</p>" +
                "</div>";
            return;
        }
        var tableEle = document.createElement("table");
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
        var tbodyEle = tableEle.getElementsByTagName("tbody")[0];
        for (var index = 0; index < recordTypes.length; index += 1) {
            var recordType = recordTypes[index];
            var trEle = document.createElement("tr");
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
    var getRecordTypesFn = function () {
        recordTypes = [];
        cityssm.clearElement(recordTypesContainerEle);
        recordTypesContainerEle.innerHTML = getLoadingHTML("Record Types");
        cityssm.postJSON(urlPrefix + "/admin/doGetRecordTypes", {}, function (responseJSON) {
            recordTypes = responseJSON.recordTypes;
            renderRecordTypesFn();
        });
    };
    document.getElementById("is-add-record-type-button").addEventListener("click", function () {
        var formEle;
        var patternEle;
        var addRecordCloseModalFn;
        var isSubmitting = false;
        var submitFn = function (formEvent) {
            formEvent.preventDefault();
            if (isSubmitting) {
                return;
            }
            if (!isValidRegex(patternEle.value)) {
                cityssm.alertModal("Regular Expression Pattern Invalid", "Please ensure you are using a valid regular expression.", "OK", "warning");
                return;
            }
            isSubmitting = true;
            cityssm.postJSON(urlPrefix + "/admin/doAddRecordType", formEle, function (responseJSON) {
                if (responseJSON.success) {
                    recordTypes.unshift(responseJSON.recordType);
                    renderRecordTypesFn();
                    addRecordCloseModalFn();
                }
                else {
                    isSubmitting = false;
                    cityssm.alertModal("Error Adding Record Type", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                }
            });
        };
        cityssm.openHtmlModal("recordType-add", {
            onshow: function () {
                formEle = document.getElementById("form--addRecordType");
                patternEle = document.getElementById("addRecordType--pattern");
                patternEle.addEventListener("keyup", function () {
                    if (isValidRegex(patternEle.value)) {
                        patternEle.classList.remove("is-danger");
                    }
                    else {
                        patternEle.classList.add("is-danger");
                    }
                });
                formEle.addEventListener("submit", submitFn);
            },
            onshown: function (_modalEle, closeModalFn) {
                addRecordCloseModalFn = closeModalFn;
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
                getRecordTypesFn();
                break;
            case "statusTypes":
                break;
        }
    };
    tabEles.forEach(function (tabEle) {
        tabEle.addEventListener("click", selectTabFn);
    });
})();
