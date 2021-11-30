"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const urlPrefix = exports.urlPrefix;
    const crmEdit = exports.crmEdit;
    const userPanelElement = document.querySelector("#panel--users");
    let recordUsers = exports.recordUsers;
    delete exports.recordUsers;
    const openRemoveRecordUserModalFunction = (clickEvent) => {
        clickEvent.preventDefault();
        const panelBlockElement = clickEvent.currentTarget.closest(".panel-block");
        const index = Number.parseInt(panelBlockElement.dataset.index, 10);
        const recordUser = recordUsers[index];
        const removeFunction = () => {
            cityssm.postJSON(urlPrefix + "/edit/doRemoveRecordUser", {
                recordUserID: recordUser.recordUserID
            }, (responseJSON) => {
                if (responseJSON.success) {
                    recordUsers.splice(index, 1);
                    crmEdit.clearPanelBlocksFunction(userPanelElement);
                    renderRecordUsersFunction();
                }
                else {
                    cityssm.alertModal("Remove User Error", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                }
            });
        };
        cityssm.confirmModal("Remove User", "Are you sure you want to remove this user?", "Yes, Remove the User", "warning", removeFunction);
    };
    const renderRecordUserFunction = (recordUser, index) => {
        const panelBlockElement = document.createElement("div");
        panelBlockElement.className = "panel-block is-block";
        panelBlockElement.dataset.recordUserId = recordUser.recordUserID.toString();
        panelBlockElement.dataset.index = index.toString();
        const recordUserType = exports.recordUserTypes.find((possibleRecordUserType) => {
            return possibleRecordUserType.recordUserTypeKey === recordUser.recordUserTypeKey;
        });
        panelBlockElement.innerHTML = "<div class=\"columns\">" +
            ("<div class=\"column\">" +
                "<strong>" + cityssm.escapeHTML(recordUserType ? recordUserType.recordUserType : recordUser.recordUserTypeKey) + "</strong><br />" +
                "<span>" + cityssm.escapeHTML(recordUser.userName) + "</span>" +
                "</div>") +
            ("<div class=\"column is-narrow\">" +
                " <button class=\"button is-danger is-light is-small has-tooltip-arrow has-tooltip-left\" data-tooltip=\"Remove User\" type=\"button\">" +
                "<span class=\"icon\"><i class=\"fas fa-trash-alt\" aria-hidden=\"true\"></i></span>" +
                "</button>" +
                "</div>") +
            "</div>";
        panelBlockElement.querySelector("button").addEventListener("click", openRemoveRecordUserModalFunction);
        userPanelElement.append(panelBlockElement);
    };
    const renderRecordUsersFunction = () => {
        crmEdit.clearPanelBlocksFunction(userPanelElement);
        if (recordUsers.length === 0) {
            userPanelElement.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
                "<div class=\"message is-info\">" +
                "<div class=\"message-body\">There are no users associated with this record.</div>" +
                "</div>" +
                "</div>");
            return;
        }
        for (const [index, recordUser] of recordUsers.entries()) {
            renderRecordUserFunction(recordUser, index);
        }
    };
    const getRecordUsers = () => {
        crmEdit.clearPanelBlocksFunction(userPanelElement);
        recordUsers = [];
        userPanelElement.insertAdjacentHTML("beforeend", crmEdit.getLoadingPanelBlockHTML("Users"));
        cityssm.postJSON(urlPrefix + "/view/doGetRecordUsers", {
            recordID: crmEdit.recordID
        }, (responseJSON) => {
            if (responseJSON.success) {
                recordUsers = responseJSON.recordUsers;
                renderRecordUsersFunction();
            }
            else {
                userPanelElement.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
                    "<div class=\"message is-danger\"><div class=\"message-body\">" +
                    responseJSON.message +
                    "</div></div>" +
                    "</div>");
            }
        });
    };
    renderRecordUsersFunction();
    const addUserButtonElement = document.querySelector("#is-add-user-button");
    if (addUserButtonElement) {
        addUserButtonElement.addEventListener("click", () => {
            let closeAddModalFunction;
            const addFunction = (formEvent) => {
                formEvent.preventDefault();
                cityssm.postJSON(urlPrefix + "/edit/doAddRecordUser", formEvent.currentTarget, (responseJSON) => {
                    if (responseJSON.success) {
                        getRecordUsers();
                        closeAddModalFunction();
                    }
                    else {
                        cityssm.alertModal("Add User Error", cityssm.escapeHTML(responseJSON.message), "OK", "danger");
                    }
                });
            };
            cityssm.openHtmlModal("user-add", {
                onshow: () => {
                    document.querySelector("#addRecordUser--recordID").value = crmEdit.recordID;
                    const recordUserTypeKeyElement = document.querySelector("#addRecordUser--recordUserTypeKey");
                    const recordUserTypes = exports.recordUserTypes;
                    for (const recordUserType of recordUserTypes) {
                        if (recordUserType.isActive) {
                            recordUserTypeKeyElement.insertAdjacentHTML("beforeend", "<option value=\"" + cityssm.escapeHTML(recordUserType.recordUserTypeKey) + "\">" +
                                cityssm.escapeHTML(recordUserType.recordUserType) +
                                "</option>");
                        }
                    }
                },
                onshown: (_modalElement, closeModalFunction) => {
                    bulmaJS.toggleHtmlClipped();
                    closeAddModalFunction = closeModalFunction;
                    document.querySelector("#form--addRecordUser").addEventListener("submit", addFunction);
                },
                onremoved: () => {
                    bulmaJS.toggleHtmlClipped();
                }
            });
        });
    }
})();
