import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
declare const cityssm: cityssmGlobal;

/*
 * Main Form
 */

(() => {

  const urlPrefix: string = exports.urlPrefix;

  const recordID = (document.getElementById("record--recordID") as HTMLInputElement).value;
  const isNew = (recordID === "");

  const formEle = document.getElementById("form--record");

  const setUnsavedChangesFn = () => {
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

  /*
   * Tags
   */

  const removeTagFn = (clickEvent: MouseEvent) => {
    clickEvent.preventDefault();

    const tagEle = (clickEvent.currentTarget as HTMLElement).closest(".tag");

    const removeFn = () => {
      tagEle.remove();
      setUnsavedChangesFn();
    };

    const tag = tagEle.getElementsByTagName("input")[0].value;

    cityssm.confirmModal("Remove Tag?",
      "Are you sure you want to remove the <span class=\"tag\">" + cityssm.escapeHTML(tag) + "</span> tag?",
      "Yes, Remove the Tag",
      "warning",
      removeFn);
  };

  const openAddTagModalFn = () => {

    let addTagModalCloseFn: () => void;

    let tagInputEle: HTMLInputElement;

    const suggestedTagLimit = 20;
    let suggestedTagLastValue = "";
    let suggestedTags = [];

    const addTagFn = (tag: string) => {

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

    const addTagBySubmitFn = (submitEvent: Event) => {
      submitEvent.preventDefault();
      const inputEle = document.getElementById("addTag--tag") as HTMLInputElement;

      if (inputEle.value === "") {
        addTagModalCloseFn();
        return;
      }

      addTagFn(inputEle.value);
      inputEle.value = "";
      inputEle.focus();
    };

    const getSuggestedTagsFn = (keyupEvent?: Event) => {

      if (keyupEvent) {
        if (suggestedTagLastValue === tagInputEle.value ||
          (tagInputEle.value.includes(suggestedTagLastValue) && suggestedTags.length < suggestedTagLimit)) {
          return;
        }
      }

      suggestedTagLastValue = tagInputEle.value;

      cityssm.postJSON(urlPrefix + "/edit/doGetSuggestedTags", {
        recordID: isNew ? "" : recordID,
        searchString: tagInputEle.value
      },
        (responseJSON: { success: boolean; tags?: string[] }) => {

          const dataListEle = document.getElementById("addTag--tag-datalist") as HTMLDataListElement;
          dataListEle.innerHTML = "";

          if (responseJSON.success) {

            suggestedTags = responseJSON.tags;

            for (const suggestedTag of suggestedTags) {

              const optionEle = document.createElement("option");
              optionEle.value = suggestedTag;
              dataListEle.appendChild(optionEle);
            }
          }
        });
    };

    cityssm.openHtmlModal("tag-add", {
      onshown: (_modalEle, closeModalFn) => {
        addTagModalCloseFn = closeModalFn;
        document.getElementById("form--addTag").addEventListener("submit", addTagBySubmitFn);

        tagInputEle = document.getElementById("addTag--tag") as HTMLInputElement;
        tagInputEle.focus();
        tagInputEle.addEventListener("keyup", getSuggestedTagsFn);
        getSuggestedTagsFn();
      }
    });
  };

  document.getElementById("is-add-tag-button").addEventListener("click", openAddTagModalFn);

  const removeTagButtonEles = document.getElementsByClassName("is-remove-tag-button");

  for (let index = 0; index < removeTagButtonEles.length; index += 1) {
    removeTagButtonEles[index].addEventListener("click", removeTagFn);
  }

})();

/*
 * Lock Toggle Buttons
 */

(() => {
  const lockToggleFn = (clickEvent: MouseEvent) => {

    clickEvent.preventDefault();

    const fieldEle = (clickEvent.currentTarget as HTMLElement).closest(".field");
    const inputEle = fieldEle.getElementsByTagName("input")[0];

    const iconEles = inputEle.nextElementSibling.children;

    if (inputEle.hasAttribute("readonly")) {
      inputEle.removeAttribute("readonly");
    } else {
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
