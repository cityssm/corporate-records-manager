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

  const formEle = document.querySelector("#form--record");

  const setUnsavedChangesFunction = () => {
    cityssm.enableNavBlocker();
  };

  formEle.addEventListener("submit", (submitEvent) => {
    submitEvent.preventDefault();

    const submitURL = urlPrefix +
      (isNew ? "/new/doCreate" : "/edit/doUpdate");

    cityssm.postJSON(submitURL, formEle,
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

  const inputEles = formEle.querySelectorAll("input, textarea");

  for (const inputEle of inputEles) {
    inputEle.addEventListener("change", setUnsavedChangesFunction);
  }

  /*
   * Tags
   */

  const removeTagFunction = (clickEvent: MouseEvent) => {
    clickEvent.preventDefault();

    const tagEle = (clickEvent.currentTarget as HTMLElement).closest(".tag");

    const removeFunction = () => {
      tagEle.remove();
      setUnsavedChangesFunction();
    };

    const tag = tagEle.querySelectorAll("input")[0].value;

    cityssm.confirmModal("Remove Tag?",
      "Are you sure you want to remove the <span class=\"tag\">" + cityssm.escapeHTML(tag) + "</span> tag?",
      "Yes, Remove the Tag",
      "warning",
      removeFunction);
  };

  const openAddTagModalFunction = () => {

    let addTagModalCloseFunction: () => void;

    let tagInputEle: HTMLInputElement;

    const suggestedTagLimit = 20;
    let suggestedTagLastValue = "";
    let suggestedTags = [];

    const addTagFunction = (tag: string) => {

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

    const addTagBySubmitFunction = (submitEvent: Event) => {
      submitEvent.preventDefault();
      const inputEle = document.querySelector("#addTag--tag") as HTMLInputElement;

      if (inputEle.value === "") {
        addTagModalCloseFunction();
        return;
      }

      addTagFunction(inputEle.value);
      inputEle.value = "";
      inputEle.focus();
    };

    const getSuggestedTagsFunction = (keyupEvent?: Event) => {

      if (keyupEvent && (suggestedTagLastValue === tagInputEle.value ||
          (tagInputEle.value.includes(suggestedTagLastValue) && suggestedTags.length < suggestedTagLimit))) {
          return;
        }

      suggestedTagLastValue = tagInputEle.value;

      cityssm.postJSON(urlPrefix + "/edit/doGetSuggestedTags", {
        recordID: isNew ? "" : recordID,
        searchString: tagInputEle.value
      },
        (responseJSON: { success: boolean; tags?: string[] }) => {

          const dataListEle = document.querySelector("#addTag--tag-datalist") as HTMLDataListElement;
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

        tagInputEle = document.querySelector("#addTag--tag") as HTMLInputElement;
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

/*
 * Lock Toggle Buttons
 */

(() => {
  const lockToggleFunction = (clickEvent: MouseEvent) => {

    clickEvent.preventDefault();

    const fieldEle = (clickEvent.currentTarget as HTMLElement).closest(".field");
    const inputEle = fieldEle.querySelectorAll("input")[0];

    const iconEles = inputEle.nextElementSibling.children;

    if (inputEle.hasAttribute("readonly")) {
      inputEle.removeAttribute("readonly");
    } else {
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
