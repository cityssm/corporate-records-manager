/* eslint-disable unicorn/prefer-module */

import type * as recordTypes from "../../types/recordTypes";
import type * as dsTypes from "@cityssm/docushare/types";

import type { CRMEdit } from "./main";

import type { BulmaJS } from "@cityssm/bulma-js/types";
import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";

declare const bulmaJS: BulmaJS;
declare const cityssm: cityssmGlobal;


(() => {

  const urlPrefix: string = exports.urlPrefix;
  const crmEdit: CRMEdit = exports.crmEdit;

  let urls: recordTypes.RecordURL[] = exports.recordURLs;
  delete exports.recordURLs;

  const urlPanelElement = document.querySelector("#panel--urls") as HTMLElement;

  const openEditURLModalFunction = (clickEvent: MouseEvent) => {

    clickEvent.preventDefault();

    const panelBlockElement = (clickEvent.currentTarget as HTMLElement).closest(".panel-block") as HTMLElement;

    const index = Number.parseInt(panelBlockElement.dataset.index, 10);
    const url = urls[index];

    let closeEditModalFunction: () => void;

    const editFunction = (formEvent: Event) => {
      formEvent.preventDefault();

      cityssm.postJSON(urlPrefix + "/edit/doUpdateURL",
        formEvent.currentTarget,
        (responseJSON: { success: boolean; message?: string }) => {

          if (responseJSON.success) {
            getURLs();
            closeEditModalFunction();
          } else {
            cityssm.alertModal("Update Link Error",
              cityssm.escapeHTML(responseJSON.message),
              "OK",
              "danger");
          }
        });
    };

    cityssm.openHtmlModal("url-edit", {
      onshow: () => {
        (document.querySelector("#editURL--urlID") as HTMLInputElement).value = url.urlID.toString();
        (document.querySelector("#editURL--url") as HTMLInputElement).value = url.url;
        (document.querySelector("#editURL--urlTitle") as HTMLInputElement).value = url.urlTitle;
        (document.querySelector("#editURL--urlDescription") as HTMLInputElement).value = url.urlDescription;

        document.querySelector("#form--editURL").addEventListener("submit", editFunction);
      },
      onshown: (_modalElement, closeModalFunction) => {
        bulmaJS.toggleHtmlClipped();
        closeEditModalFunction = closeModalFunction;
      },
      onremoved: () => {
        bulmaJS.toggleHtmlClipped();
      }
    });
  };

  const openRemoveURLModalFunction = (clickEvent: MouseEvent) => {

    clickEvent.preventDefault();

    const panelBlockElement = (clickEvent.currentTarget as HTMLElement).closest(".panel-block") as HTMLElement;

    const index = Number.parseInt(panelBlockElement.dataset.index, 10);
    const url = urls[index];

    const removeFunction = () => {

      cityssm.postJSON(urlPrefix + "/edit/doRemoveURL", {
        urlID: url.urlID
      }, (responseJSON: { success: boolean; message?: string }) => {

        if (responseJSON.success) {
          urls.splice(index, 1);
          crmEdit.clearPanelBlocksFunction(urlPanelElement);
          renderURLsFunction();

        } else {
          cityssm.alertModal("Remove Link Error",
            cityssm.escapeHTML(responseJSON.message),
            "OK",
            "danger");
        }
      });
    };

    cityssm.confirmModal("Remove Link",
      "Are you sure you want to remove the link to \"" + cityssm.escapeHTML(url.urlTitle) + "\"?",
      "Yes, Remove the Link",
      "warning",
      removeFunction);
  };

  const renderURLFunction = (url: recordTypes.RecordURL, index: number) => {

    const panelBlockElement = document.createElement("div");
    panelBlockElement.className = "panel-block is-block";
    panelBlockElement.dataset.urlId = url.urlID.toString();
    panelBlockElement.dataset.index = index.toString();

    panelBlockElement.innerHTML = "<div class=\"columns\">" +
      ("<div class=\"column\">" +
        "<a class=\"has-text-weight-bold\" href=\"" + cityssm.escapeHTML(url.url) + "\" target=\"_blank\">" +
        cityssm.escapeHTML(url.urlTitle) +
        "</a><br />" +
        "<span class=\"tag has-tooltip-arrow has-tooltip-right\" data-tooltip=\"Link Domain\">" + url.url.split("/")[2] + "</span><br />" +
        "<span class=\"is-size-7\">" + cityssm.escapeHTML(url.urlDescription) + "</span>" +
        "</div>") +
      ("<div class=\"column is-narrow\">" +
        "<button class=\"button is-info is-light is-small\" type=\"button\">" +
        "<span class=\"icon\"><i class=\"fas fa-pencil-alt\" aria-hidden=\"true\"></i></span>" +
        "<span>Edit</span>" +
        "</button>" +
        " <button class=\"button is-danger is-light is-small has-tooltip-arrow has-tooltip-left\" data-tooltip=\"Remove Link\" type=\"button\">" +
        "<span class=\"icon\"><i class=\"fas fa-trash-alt\" aria-hidden=\"true\"></i></span>" +
        "</button>" +
        "</div>") +
      "</div>";

    const buttonElements = panelBlockElement.querySelectorAll("button");
    buttonElements[0].addEventListener("click", openEditURLModalFunction);
    buttonElements[1].addEventListener("click", openRemoveURLModalFunction);

    urlPanelElement.append(panelBlockElement);
  };

  const renderURLsFunction = () => {

    crmEdit.clearPanelBlocksFunction(urlPanelElement);

    if (urls.length === 0) {
      urlPanelElement.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
        "<div class=\"message is-info\">" +
        "<div class=\"message-body\">There are no links associated with this record.</div>" +
        "</div>" +
        "</div>");

      return;
    }

    for (const [index, url] of urls.entries()) {
      renderURLFunction(url, index);
    }
  };

  const getURLs = () => {

    crmEdit.clearPanelBlocksFunction(urlPanelElement);
    urls = [];

    urlPanelElement.insertAdjacentHTML("beforeend", crmEdit.getLoadingPanelBlockHTML("Links"));

    cityssm.postJSON(urlPrefix + "/view/doGetURLs", {
      recordID: crmEdit.recordID
    },
      (responseJSON: { success: boolean; urls: recordTypes.RecordURL[]; message?: string }) => {

        if (responseJSON.success) {
          urls = responseJSON.urls;
          renderURLsFunction();
        } else {

          urlPanelElement.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
            "<div class=\"message is-danger\"><div class=\"message-body\">" +
            responseJSON.message +
            "</div></div>" +
            "</div>");
        }
      });
  };

  renderURLsFunction();

  document.querySelector("#is-add-url-button").addEventListener("click", () => {

    let closeAddModalFunction: () => void;

    const addFunction = (formEvent: Event) => {
      formEvent.preventDefault();

      cityssm.postJSON(urlPrefix + "/edit/doAddURL",
        formEvent.currentTarget,
        (responseJSON: { success: boolean; message?: string }) => {

          if (responseJSON.success) {
            getURLs();
            closeAddModalFunction();
          } else {
            cityssm.alertModal("Add Link Error",
              cityssm.escapeHTML(responseJSON.message),
              "OK",
              "danger");
          }
        });
    };

    cityssm.openHtmlModal("url-add", {
      onshow: () => {
        (document.querySelector("#addURL--recordID") as HTMLInputElement).value = crmEdit.recordID;

        document.querySelector("#form--addURL").addEventListener("submit", addFunction);
      },
      onshown: (_modalElement, closeModalFunction) => {
        bulmaJS.toggleHtmlClipped();
        closeAddModalFunction = closeModalFunction;
      },
      onremoved: () => {
        bulmaJS.toggleHtmlClipped();
      }
    });
  });

  const addDocuShareButtonElement = document.querySelector("#is-add-docushare-url-button");

  if (addDocuShareButtonElement) {

    addDocuShareButtonElement.addEventListener("click", () => {

      let doRefreshOnClose = false;

      let searchFormElement: HTMLFormElement;
      let searchResultsContainerElement: HTMLElement;

      const addFunction = (event: MouseEvent) => {

        event.preventDefault();

        const buttonElement = event.currentTarget as HTMLButtonElement;

        buttonElement.disabled = true;

        const panelBlockElement = buttonElement.closest(".panel-block") as HTMLElement;

        const handle = panelBlockElement.dataset.handle;

        cityssm.postJSON(urlPrefix + "/edit/doAddDocuShareURL", {
          recordID: crmEdit.recordID,
          handle: handle
        },
          (responseJSON: { success: boolean; message?: string }) => {

            if (responseJSON.success) {
              doRefreshOnClose = true;
              panelBlockElement.remove();

            } else {
              cityssm.alertModal("Error Adding Link",
                cityssm.escapeHTML(responseJSON.message),
                "OK",
                "danger");

              buttonElement.disabled = false;
            }
          });
      };

      const searchDocuShareFunction = (event?: Event) => {

        if (event) {
          event.preventDefault();
        }

        searchResultsContainerElement.innerHTML = "<div class=\"has-text-centered has-text-grey\">" +
          "<i class=\"fas fa-4x fa-spinner fa-pulse\" aria-hidden=\"true\"></i><br />" +
          "Searching DocuShare..." +
          "</div>";

        cityssm.postJSON(urlPrefix + "/edit/doSearchDocuShare", searchFormElement,
          (responseJSON: { success: boolean; message?: string; dsObjects?: dsTypes.DocuShareObject[] }) => {

            if (!responseJSON.success) {

              searchResultsContainerElement.innerHTML = "<div class=\"message is-danger\">" +
                "<div class=\"message-body\">" +
                "<p>An error occurred retrieving documents from DocuShare.</p>" +
                "<p>" + cityssm.escapeHTML(responseJSON.message) + "</p>" +
                "</div>" +
                "</div>";

              return;
            }

            const panelElement = document.createElement("div");
            panelElement.className = "panel";

            for (const dsObject of responseJSON.dsObjects) {

              if (urlPanelElement.querySelector("a[href='" + dsObject.url + "']")) {
                continue;
              }

              const panelBlockElement = document.createElement("div");
              panelBlockElement.className = "panel-block is-block";
              panelBlockElement.dataset.handle = dsObject.handle;

              panelBlockElement.innerHTML = "<div class=\"level\">" +
                ("<div class=\"level-left\">" +
                  "<strong>" + cityssm.escapeHTML(dsObject.title) + "</strong>" +
                  "</div>") +
                ("<div class=\"level-right\">" +
                  "<a class=\"button is-info mr-1\" href=\"" + dsObject.url + "\" target=\"_blank\">" +
                  "<span class=\"icon\"><i class=\"fas fa-eye\" aria-hidden=\"true\"></i></span>" +
                  "<span>View</span>" +
                  "</a>" +
                  "<button class=\"button is-success\" type=\"button\">" +
                  "<span class=\"icon\"><i class=\"fas fa-plus\" aria-hidden=\"true\"></i></span>" +
                  "<span>Add Link</span>" +
                  "</button>" +
                  "</div>") +
                "</div>";

              panelBlockElement.querySelectorAll("button")[0].addEventListener("click", addFunction);

              panelElement.append(panelBlockElement);
            }

            searchResultsContainerElement.innerHTML = "";

            if (panelElement.children.length === 0) {
              searchResultsContainerElement.innerHTML = "<div class=\"message is-info\">" +
                "<div class=\"message-body\">" +
                "<p>There are no new files in DocuShare that meet your search criteria.</p>" +
                "</div>" +
                "</div>";

            } else {

              searchResultsContainerElement.append(panelElement);
            }
          });
      };

      cityssm.openHtmlModal("docushare-url-add", {
        onshow: () => {

          searchResultsContainerElement = document.querySelector("#container--addDocuShareURL");

          searchFormElement = document.querySelector("#form--addDocuShareURL-search") as HTMLFormElement;
          searchFormElement.addEventListener("submit", searchDocuShareFunction);

          const collectionSelectElement = document.querySelector("#addDocuShareURL--collectionHandleIndex") as HTMLSelectElement;

          for (let index = 0; index < exports.docuShareCollectionHandles.length; index += 1) {
            const optionElement = document.createElement("option");
            optionElement.value = index.toString();
            optionElement.textContent = exports.docuShareCollectionHandles[index].title;
            collectionSelectElement.append(optionElement);

            if (index === 0) {
              collectionSelectElement.value = index.toString();
            }
          }

          collectionSelectElement.addEventListener("change", searchDocuShareFunction);

          const searchStringElement = document.querySelector("#addDocuShareURL--searchString") as HTMLInputElement;
          searchStringElement.value = (document.querySelector("#record--recordNumber") as HTMLInputElement).value;

          searchDocuShareFunction();
        },
        onshown: () => {
          bulmaJS.toggleHtmlClipped();
        },
        onhidden: () => {
          if (doRefreshOnClose) {
            getURLs();
          }
        },
        onremoved: () => {
          bulmaJS.toggleHtmlClipped();
        }
      });
    });
  }
})();
