"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(function () {
    var urlPrefix = exports.urlPrefix;
    var recordID = document.getElementById("record--recordID").value;
    var isNew = (recordID === "");
    var formEle = document.getElementById("form--record");
    var setUnsavedChangesFn = function () {
        cityssm.enableNavBlocker();
    };
    formEle.addEventListener("submit", function (submitEvent) {
        submitEvent.preventDefault();
        var submitURL = urlPrefix +
            (isNew ? "/new/doCreate" : "/edit/doUpdate");
        cityssm.postJSON(submitURL, formEle, function (responseJSON) {
            if (responseJSON.success) {
                cityssm.disableNavBlocker();
                if (isNew) {
                    window.location.href = urlPrefix + "/records/edit/" + responseJSON.recordID.toString();
                }
                else {
                    cityssm.alertModal("Record Updated Successfully", "", "OK", "success");
                }
            }
            else {
                cityssm.alertModal("Error While Saving", responseJSON.message, "OK", "danger");
            }
        });
    });
    var removeTagFn = function (clickEvent) {
        clickEvent.preventDefault();
        var tagEle = clickEvent.currentTarget.closest(".tag");
        var removeFn = function () {
            tagEle.remove();
            setUnsavedChangesFn();
        };
        var tag = tagEle.getElementsByTagName("input")[0].value;
        cityssm.confirmModal("Remove Tag?", "Are you sure you want to remove the <span class=\"tag\">" + cityssm.escapeHTML(tag) + "</span> tag?", "Yes, Remove the Tag", "warning", removeFn);
    };
    var openAddTagModalFn = function () {
        var addTagModalCloseFn;
        var addTagFn = function (tag) {
            var escapedTag = cityssm.escapeHTML(tag);
            var tagEle = document.createElement("span");
            tagEle.className = "tag is-medium";
            tagEle.innerHTML = "<input name=\"tags\" type=\"hidden\" value=\"" + escapedTag + "\" /> " +
                escapedTag +
                " <button class=\"delete\" type=\"button\" aria-label=\"Remove Tag\"></button>";
            tagEle.getElementsByTagName("button")[0].addEventListener("click", removeTagFn);
            document.getElementById("container--tags").insertAdjacentElement("afterbegin", tagEle);
            setUnsavedChangesFn();
        };
        var addTagBySubmitFn = function (submitEvent) {
            submitEvent.preventDefault();
            var inputEle = document.getElementById("addTag--tag");
            if (inputEle.value === "") {
                addTagModalCloseFn();
                return;
            }
            addTagFn(inputEle.value);
            inputEle.value = "";
            inputEle.focus();
        };
        cityssm.openHtmlModal("tag-add", {
            onshown: function (_modalEle, closeModalFn) {
                addTagModalCloseFn = closeModalFn;
                document.getElementById("form--addTag").addEventListener("submit", addTagBySubmitFn);
            }
        });
    };
    document.getElementById("is-add-tag-button").addEventListener("click", openAddTagModalFn);
    var removeTagButtonEles = document.getElementsByClassName("is-remove-tag-button");
    for (var index = 0; index < removeTagButtonEles.length; index += 1) {
        removeTagButtonEles[index].addEventListener("click", removeTagFn);
    }
})();
(function () {
    var lockToggleFn = function (clickEvent) {
        clickEvent.preventDefault();
        var fieldEle = clickEvent.currentTarget.closest(".field");
        var inputEle = fieldEle.getElementsByTagName("input")[0];
        var iconEles = inputEle.nextElementSibling.children;
        if (inputEle.hasAttribute("readonly")) {
            inputEle.removeAttribute("readonly");
        }
        else {
            inputEle.setAttribute("readonly", "readonly");
        }
        for (var index = 0; index < iconEles.length; index += 1) {
            iconEles[index].classList.toggle("is-hidden");
        }
    };
    var lockToggleButtonEles = document.getElementsByClassName("is-lock-toggle-button");
    for (var index = 0; index < lockToggleButtonEles.length; index += 1) {
        lockToggleButtonEles[index].addEventListener("click", lockToggleFn);
    }
})();
