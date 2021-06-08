(() => {
    const urlPrefix = exports.urlPrefix;
    const recordID = document.getElementById("record--recordID").value;
    const isNew = (recordID === "");
    const formEle = document.getElementById("form--record");
    const setUnsavedChangesFn = () => {
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
    const removeTagFn = (clickEvent) => {
        clickEvent.preventDefault();
        const tagEle = clickEvent.currentTarget.closest(".tag");
        const removeFn = () => {
            tagEle.remove();
            setUnsavedChangesFn();
        };
        const tag = tagEle.getElementsByTagName("input")[0].value;
        cityssm.confirmModal("Remove Tag?", "Are you sure you want to remove the <span class=\"tag\">" + cityssm.escapeHTML(tag) + "</span> tag?", "Yes, Remove the Tag", "warning", removeFn);
    };
    const openAddTagModalFn = () => {
        let addTagModalCloseFn;
        const addTagFn = (tag) => {
            const escapedTag = cityssm.escapeHTML(tag);
            const tagEle = document.createElement("span");
            tagEle.className = "tag is-medium";
            tagEle.innerHTML = "<input name=\"tags\" type=\"hidden\" value=\"" + escapedTag + "\" /> " +
                escapedTag +
                " <button class=\"delete\" type=\"button\" aria-label=\"Remove Tag\"></button>";
            tagEle.getElementsByTagName("button")[0].addEventListener("click", removeTagFn);
            document.getElementById("container--tags").insertAdjacentElement("afterbegin", tagEle);
            setUnsavedChangesFn();
        };
        const addTagBySubmitFn = (submitEvent) => {
            submitEvent.preventDefault();
            const inputEle = document.getElementById("addTag--tag");
            if (inputEle.value === "") {
                addTagModalCloseFn();
                return;
            }
            addTagFn(inputEle.value);
            inputEle.value = "";
            inputEle.focus();
        };
        cityssm.openHtmlModal("tag-add", {
            onshown: (_modalEle, closeModalFn) => {
                addTagModalCloseFn = closeModalFn;
                document.getElementById("form--addTag").addEventListener("submit", addTagBySubmitFn);
            }
        });
    };
    document.getElementById("is-add-tag-button").addEventListener("click", openAddTagModalFn);
    const removeTagButtonEles = document.getElementsByClassName("is-remove-tag-button");
    for (let index = 0; index < removeTagButtonEles.length; index += 1) {
        removeTagButtonEles[index].addEventListener("click", removeTagFn);
    }
})();
(() => {
    const lockToggleFn = (clickEvent) => {
        clickEvent.preventDefault();
        const fieldEle = clickEvent.currentTarget.closest(".field");
        const inputEle = fieldEle.getElementsByTagName("input")[0];
        const iconEles = inputEle.nextElementSibling.children;
        if (inputEle.hasAttribute("readonly")) {
            inputEle.removeAttribute("readonly");
        }
        else {
            inputEle.setAttribute("readonly", "readonly");
        }
        for (let index = 0; index < iconEles.length; index += 1) {
            iconEles[index].classList.toggle("is-hidden");
        }
    };
    const lockToggleButtonEles = document.getElementsByClassName("is-lock-toggle-button");
    for (let index = 0; index < lockToggleButtonEles.length; index += 1) {
        lockToggleButtonEles[index].addEventListener("click", lockToggleFn);
    }
})();
export {};
