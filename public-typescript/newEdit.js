"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const urlPrefix = exports.urlPrefix;
    const recordID = document.querySelector("#record--recordID").value;
    const isNew = (recordID === "");
    const formEle = document.querySelector("#form--record");
    const setUnsavedChangesFunction = () => {
        cityssm.enableNavBlocker();
    };
    formEle.addEventListener("submit", (submitEvent) => {
        submitEvent.preventDefault();
        const submitURL = urlPrefix +
            (isNew ? "/new/doCreate" : "/edit/doUpdate");
        cityssm.postJSON(submitURL, formEle, (responseJSON) => {
            if (responseJSON.success) {
                cityssm.disableNavBlocker();
                if (isNew) {
                    window.location.href = urlPrefix + "/edit/" + responseJSON.recordID.toString();
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
    const inputEles = formEle.querySelectorAll("input, textarea");
    for (const inputEle of inputEles) {
        inputEle.addEventListener("change", setUnsavedChangesFunction);
    }
    const removeTagFunction = (clickEvent) => {
        clickEvent.preventDefault();
        const tagEle = clickEvent.currentTarget.closest(".tag");
        const removeFunction = () => {
            tagEle.remove();
            setUnsavedChangesFunction();
        };
        const tag = tagEle.querySelector("input").value;
        cityssm.confirmModal("Remove Tag?", "Are you sure you want to remove the <span class=\"tag\">" + cityssm.escapeHTML(tag) + "</span> tag?", "Yes, Remove the Tag", "warning", removeFunction);
    };
    const openAddTagModalFunction = () => {
        let addTagModalCloseFunction;
        let tagInputEle;
        const suggestedTagLimit = 20;
        let suggestedTagLastValue = "";
        let suggestedTags = [];
        const addTagFunction = (tag) => {
            const escapedTag = cityssm.escapeHTML(tag);
            const tagEle = document.createElement("span");
            tagEle.className = "tag is-medium";
            tagEle.innerHTML = "<input name=\"tags\" type=\"hidden\" value=\"" + escapedTag + "\" /> " +
                escapedTag +
                " <button class=\"delete\" type=\"button\" aria-label=\"Remove Tag\"></button>";
            tagEle.querySelectorAll("button")[0].addEventListener("click", removeTagFunction);
            document.querySelector("#container--tags").insertAdjacentElement("afterbegin", tagEle);
            setUnsavedChangesFunction();
        };
        const addTagBySubmitFunction = (submitEvent) => {
            submitEvent.preventDefault();
            const inputEle = document.querySelector("#addTag--tag");
            if (inputEle.value === "") {
                addTagModalCloseFunction();
                return;
            }
            addTagFunction(inputEle.value);
            inputEle.value = "";
            inputEle.focus();
        };
        const getSuggestedTagsFunction = (keyupEvent) => {
            if (keyupEvent && (suggestedTagLastValue === tagInputEle.value ||
                (tagInputEle.value.includes(suggestedTagLastValue) && suggestedTags.length < suggestedTagLimit))) {
                return;
            }
            suggestedTagLastValue = tagInputEle.value;
            cityssm.postJSON(urlPrefix + "/edit/doGetSuggestedTags", {
                recordID: isNew ? "" : recordID,
                searchString: tagInputEle.value
            }, (responseJSON) => {
                const dataListEle = document.querySelector("#addTag--tag-datalist");
                dataListEle.innerHTML = "";
                if (responseJSON.success) {
                    suggestedTags = responseJSON.tags;
                    for (const suggestedTag of suggestedTags) {
                        const optionEle = document.createElement("option");
                        optionEle.value = suggestedTag;
                        dataListEle.append(optionEle);
                    }
                }
            });
        };
        cityssm.openHtmlModal("tag-add", {
            onshown: (_modalEle, closeModalFunction) => {
                addTagModalCloseFunction = closeModalFunction;
                document.querySelector("#form--addTag").addEventListener("submit", addTagBySubmitFunction);
                tagInputEle = document.querySelector("#addTag--tag");
                tagInputEle.focus();
                tagInputEle.addEventListener("keyup", getSuggestedTagsFunction);
                getSuggestedTagsFunction();
            }
        });
    };
    document.querySelector("#is-add-tag-button").addEventListener("click", openAddTagModalFunction);
    const removeTagButtonEles = document.querySelectorAll(".is-remove-tag-button");
    for (const removeTagButtonEle of removeTagButtonEles) {
        removeTagButtonEle.addEventListener("click", removeTagFunction);
    }
})();
(() => {
    const lockToggleFunction = (clickEvent) => {
        clickEvent.preventDefault();
        const fieldEle = clickEvent.currentTarget.closest(".field");
        const inputEle = fieldEle.querySelector("input");
        const iconEles = inputEle.nextElementSibling.children;
        if (inputEle.hasAttribute("readonly")) {
            inputEle.removeAttribute("readonly");
        }
        else {
            inputEle.setAttribute("readonly", "readonly");
        }
        for (const iconEle of iconEles) {
            iconEle.classList.toggle("is-hidden");
        }
    };
    const lockToggleButtonEles = document.querySelectorAll(".is-lock-toggle-button");
    for (const lockToggleButtonEle of lockToggleButtonEles) {
        lockToggleButtonEle.addEventListener("click", lockToggleFunction);
    }
})();
