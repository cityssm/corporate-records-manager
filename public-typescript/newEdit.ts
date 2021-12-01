/* eslint-disable unicorn/prefer-module */

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
declare const cityssm: cityssmGlobal;

/*
 * Main Form
 */

(() => {
  const urlPrefix: string = exports.urlPrefix;

  const recordID = (document.querySelector("#record--recordID") as HTMLInputElement).value;
  const isNew = (recordID === "");

  const formElement = document.querySelector("#form--record");

  const setUnsavedChangesFunction = () => {
    cityssm.enableNavBlocker();
  };

  formElement.addEventListener("submit", (submitEvent) => {
    submitEvent.preventDefault();

    const submitURL = urlPrefix +
      (isNew ? "/new/doCreate" : "/edit/doUpdate");

    cityssm.postJSON(submitURL, formElement,
      (responseJSON: { success: boolean; recordID?: number; message?: string }) => {

        if (responseJSON.success) {
          cityssm.disableNavBlocker();

          if (isNew) {
            window.location.href = urlPrefix + "/edit/" + responseJSON.recordID.toString();
          } else {
            cityssm.alertModal("Record Updated Successfully", "", "OK", "success");
          }

        } else {
          cityssm.alertModal("Error While Saving", responseJSON.message, "OK", "danger");
        }
      });
  });

  const inputElements = formElement.querySelectorAll("input, textarea");

  for (const inputElement of inputElements) {
    inputElement.addEventListener("change", setUnsavedChangesFunction);
  }

  /*
   * Tags
   */

  const removeTagFunction = (clickEvent: MouseEvent) => {
    clickEvent.preventDefault();

    const tagElement = (clickEvent.currentTarget as HTMLElement).closest(".tag");

    const removeFunction = () => {
      tagElement.remove();
      setUnsavedChangesFunction();
    };

    const tag = tagElement.querySelector("input").value;

    cityssm.confirmModal("Remove Tag?",
      "Are you sure you want to remove the <span class=\"tag\">" + cityssm.escapeHTML(tag) + "</span> tag?",
      "Yes, Remove the Tag",
      "warning",
      removeFunction);
  };

  const openAddTagModalFunction = () => {

    let addTagModalCloseFunction: () => void;

    let tagInputElement: HTMLInputElement;

    const suggestedTagLimit = 20;
    let suggestedTagLastValue = "";
    let suggestedTags = [];

    const addTagFunction = (tag: string) => {

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

    const addTagBySubmitFunction = (submitEvent: Event) => {
      submitEvent.preventDefault();
      const inputElement = document.querySelector("#addTag--tag") as HTMLInputElement;

      if (inputElement.value === "") {
        addTagModalCloseFunction();
        return;
      }

      addTagFunction(inputElement.value);
      inputElement.value = "";
      inputElement.focus();
    };

    const getSuggestedTagsFunction = (keyupEvent?: Event) => {

      if (keyupEvent && (suggestedTagLastValue === tagInputElement.value ||
          (tagInputElement.value.includes(suggestedTagLastValue) && suggestedTags.length < suggestedTagLimit))) {
          return;
        }

      suggestedTagLastValue = tagInputElement.value;

      cityssm.postJSON(urlPrefix + "/edit/doGetSuggestedTags", {
        recordID: isNew ? "" : recordID,
        searchString: tagInputElement.value
      },
        (responseJSON: { success: boolean; tags?: string[] }) => {

          const dataListElement = document.querySelector("#addTag--tag-datalist") as HTMLDataListElement;
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

        tagInputElement = document.querySelector("#addTag--tag") as HTMLInputElement;
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

/*
 * Lock Toggle Buttons
 */

(() => {
  const lockToggleFunction = (clickEvent: MouseEvent) => {

    clickEvent.preventDefault();

    const fieldElement = (clickEvent.currentTarget as HTMLElement).closest(".field");
    const inputElement = fieldElement.querySelector("input");

    const iconElements = inputElement.nextElementSibling.children;

    if (inputElement.hasAttribute("readonly")) {
      inputElement.removeAttribute("readonly");
    } else {
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
