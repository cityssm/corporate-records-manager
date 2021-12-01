"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const urlPrefix = exports.urlPrefix;
    const recordID = document.querySelector("#record--recordID").value;
    const isNew = (recordID === "");
    const formElement = document.querySelector("#form--record");
    const setUnsavedChangesFunction = () => {
        cityssm.enableNavBlocker();
    };
    formElement.addEventListener("submit", (submitEvent) => {
        submitEvent.preventDefault();
        const submitURL = urlPrefix +
            (isNew ? "/new/doCreate" : "/edit/doUpdate");
        cityssm.postJSON(submitURL, formElement, (responseJSON) => {
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
    const inputElements = formElement.querySelectorAll("input, textarea");
    for (const inputElement of inputElements) {
        inputElement.addEventListener("change", setUnsavedChangesFunction);
    }
    const removeTagFunction = (clickEvent) => {
        clickEvent.preventDefault();
        const tagElement = clickEvent.currentTarget.closest(".tag");
        const removeFunction = () => {
            tagElement.remove();
            setUnsavedChangesFunction();
        };
        const tag = tagElement.querySelector("input").value;
        cityssm.confirmModal("Remove Tag?", "Are you sure you want to remove the <span class=\"tag\">" + cityssm.escapeHTML(tag) + "</span> tag?", "Yes, Remove the Tag", "warning", removeFunction);
    };
    const openAddTagModalFunction = () => {
        let addTagModalCloseFunction;
        let tagInputElement;
        const suggestedTagLimit = 20;
        let suggestedTagLastValue = "";
        let suggestedTags = [];
        const addTagFunction = (tag) => {
            const escapedTag = cityssm.escapeHTML(tag);
            const tagElement = document.createElement("span");
            tagElement.className = "tag is-medium";
            tagElement.innerHTML = "<input name=\"tags\" type=\"hidden\" value=\"" + escapedTag + "\" /> " +
                escapedTag +
                " <button class=\"delete\" type=\"button\" aria-label=\"Remove Tag\"></button>";
            tagElement.querySelectorAll("button")[0].addEventListener("click", removeTagFunction);
            document.querySelector("#container--tags").insertAdjacentElement("afterbegin", tagElement);
            setUnsavedChangesFunction();
        };
        const addTagBySubmitFunction = (submitEvent) => {
            submitEvent.preventDefault();
            const inputElement = document.querySelector("#addTag--tag");
            if (inputElement.value === "") {
                addTagModalCloseFunction();
                return;
            }
            addTagFunction(inputElement.value);
            inputElement.value = "";
            inputElement.focus();
        };
        const getSuggestedTagsFunction = (keyupEvent) => {
            if (keyupEvent && (suggestedTagLastValue === tagInputElement.value ||
                (tagInputElement.value.includes(suggestedTagLastValue) && suggestedTags.length < suggestedTagLimit))) {
                return;
            }
            suggestedTagLastValue = tagInputElement.value;
            cityssm.postJSON(urlPrefix + "/edit/doGetSuggestedTags", {
                recordID: isNew ? "" : recordID,
                searchString: tagInputElement.value
            }, (responseJSON) => {
                const dataListElement = document.querySelector("#addTag--tag-datalist");
                dataListElement.innerHTML = "";
                if (responseJSON.success) {
                    suggestedTags = responseJSON.tags;
                    for (const suggestedTag of suggestedTags) {
                        const optionElement = document.createElement("option");
                        optionElement.value = suggestedTag;
                        dataListElement.append(optionElement);
                    }
                }
            });
        };
        cityssm.openHtmlModal("tag-add", {
            onshown: (_modalElement, closeModalFunction) => {
                addTagModalCloseFunction = closeModalFunction;
                document.querySelector("#form--addTag").addEventListener("submit", addTagBySubmitFunction);
                tagInputElement = document.querySelector("#addTag--tag");
                tagInputElement.focus();
                tagInputElement.addEventListener("keyup", getSuggestedTagsFunction);
                getSuggestedTagsFunction();
            }
        });
    };
    document.querySelector("#is-add-tag-button").addEventListener("click", openAddTagModalFunction);
    const removeTagButtonElements = document.querySelectorAll(".is-remove-tag-button");
    for (const removeTagButtonElement of removeTagButtonElements) {
        removeTagButtonElement.addEventListener("click", removeTagFunction);
    }
})();
(() => {
    const lockToggleFunction = (clickEvent) => {
        clickEvent.preventDefault();
        const fieldElement = clickEvent.currentTarget.closest(".field");
        const inputElement = fieldElement.querySelector("input");
        const iconElements = inputElement.nextElementSibling.children;
        if (inputElement.hasAttribute("readonly")) {
            inputElement.removeAttribute("readonly");
        }
        else {
            inputElement.setAttribute("readonly", "readonly");
        }
        for (const iconElement of iconElements) {
            iconElement.classList.toggle("is-hidden");
        }
    };
    const lockToggleButtonElements = document.querySelectorAll(".is-lock-toggle-button");
    for (const lockToggleButtonElement of lockToggleButtonElements) {
        lockToggleButtonElement.addEventListener("click", lockToggleFunction);
    }
})();
