import type * as recordTypes from "../types/recordTypes";
import type * as dsTypes from "@cityssm/docushare/types";

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
declare const cityssm: cityssmGlobal;


(() => {
  const urlPrefix: string = exports.urlPrefix;
  const recordID = (document.getElementById("record--recordID") as HTMLInputElement).value;

  const recordTypeKeyEle = document.getElementById("record--recordTypeKey") as HTMLInputElement;
  const recordTypeKey = recordTypeKeyEle.value;
  const recordType = recordTypeKeyEle.getAttribute("data-record-type");

  const clearPanelBlocksFn = (panelEle: HTMLElement) => {

    const panelBlockEles = panelEle.getElementsByClassName("panel-block");

    for (let index = 0; index < panelBlockEles.length; index += 1) {
      panelBlockEles[index].remove();
    }
  };

  /*
   * Statuses
   */

  {
    const statusPanelEle = document.getElementById("panel--statuses");

    const renderStatusesFn = (statuses: recordTypes.RecordStatus[]) => {
      clearPanelBlocksFn(statusPanelEle);
    };

    renderStatusesFn(exports.recordStatuses);
    delete exports.recordStatuses;
  }

  /*
   * URLs
   */

  {
    const urlPanelEle = document.getElementById("panel--urls");

    const renderURLsFn = (urls: recordTypes.RecordURL[]) => {

      clearPanelBlocksFn(urlPanelEle);

      if (urls.length === 0) {
        urlPanelEle.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
          "<div class=\"message is-info\">" +
          "<div class=\"message-body\">There are no links associated with this record.</div>" +
          "</div>" +
          "</div>");

        return;
      }

      for (const url of urls) {

        const panelBlockEle = document.createElement("div");
        panelBlockEle.className = "panel-block is-block";
        panelBlockEle.setAttribute("data-url-id", url.urlID.toString());

        panelBlockEle.innerHTML =
          "<a class=\"has-text-weight-bold\" href=\"" + cityssm.escapeHTML(url.url) + "\" target=\"_blank\">" +
          cityssm.escapeHTML(url.urlTitle) +
          "</a><br />" +
          "<span class=\"tag\">" + url.url.split("/")[2] + "</span>" +
          cityssm.escapeHTML(url.urlDescription);

        urlPanelEle.appendChild(panelBlockEle);
      }
    };

    const getURLs = () => {

      clearPanelBlocksFn(urlPanelEle);

      urlPanelEle.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block has-text-centered has-text-grey\">" +
        "<i class=\"fas fa-4x fa-spinner fa-pulse\" aria-hidden=\"true\"></i><br />" +
        "Loading Links..." +
        "</div>");

      cityssm.postJSON(urlPrefix + "/view/doGetURLs", {
        recordID
      },
        (responseJSON: { success: boolean; urls: recordTypes.RecordURL[]; message?: string }) => {

          if (responseJSON.success) {
            renderURLsFn(responseJSON.urls);
          } else {

            urlPanelEle.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
              "<div class=\"message is-danger\"><div class=\"message-body\">" +
              responseJSON.message +
              "</div></div>" +
              "</div>");
          }
        });
    };

    const addDocuShareButtonEle = document.getElementById("is-add-docushare-url-button");

    if (addDocuShareButtonEle) {

      addDocuShareButtonEle.addEventListener("click", () => {

        let doRefreshOnClose = false;

        let searchFormEle: HTMLFormElement;
        let searchResultsContainerEle: HTMLElement;

        const addFn = (event: MouseEvent) => {

          event.preventDefault();

          const buttonEle = event.currentTarget as HTMLButtonElement;

          buttonEle.disabled = true;

          const panelBlockEle = buttonEle.closest(".panel-block");

          const handle = panelBlockEle.getAttribute("data-handle");

          cityssm.postJSON(urlPrefix + "/edit/doAddDocuShareLink", {
            recordID,
            handle: handle
          },
            (responseJSON: { success: boolean; message?: string }) => {

              if (responseJSON.success) {
                doRefreshOnClose = true;
                panelBlockEle.remove();

              } else {
                cityssm.alertModal("Error Adding Link",
                  cityssm.escapeHTML(responseJSON.message),
                  "OK",
                  "danger");

                buttonEle.disabled = false;
              }
            });
        };

        const searchDocuShareFn = (event?: Event) => {

          if (event) {
            event.preventDefault();
          }

          searchResultsContainerEle.innerHTML = "<div class=\"has-text-centered has-text-grey\">" +
            "<i class=\"fas fa-4x fa-spinner fa-pulse\" aria-hidden=\"true\"></i><br />" +
            "Searching DocuShare..." +
            "</div>";

          cityssm.postJSON(urlPrefix + "/edit/doSearchDocuShare", searchFormEle,
            (responseJSON: { success: boolean; message?: string; dsObjects?: dsTypes.DocuShareObject[] }) => {

              if (!responseJSON.success) {

                searchResultsContainerEle.innerHTML = "<div class=\"message is-danger\">" +
                  "<div class=\"message-body\">" +
                  "<p>An error occurred retrieving documents from DocuShare.</p>" +
                  "<p>" + cityssm.escapeHTML(responseJSON.message) + "</p>" +
                  "</div>" +
                  "</div>";

                return;
              }

              const panelEle = document.createElement("div");
              panelEle.className = "panel";

              for (const dsObject of responseJSON.dsObjects) {

                if (urlPanelEle.querySelector("a[href='" + dsObject.url + "']")) {
                  continue;
                }

                const panelBlockEle = document.createElement("div");
                panelBlockEle.className = "panel-block is-block";
                panelBlockEle.setAttribute("data-handle", dsObject.handle);

                panelBlockEle.innerHTML = "<div class=\"level\">" +
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

                panelBlockEle.getElementsByTagName("button")[0].addEventListener("click", addFn);

                panelEle.appendChild(panelBlockEle);
              }

              searchResultsContainerEle.innerHTML = "";

              if (panelEle.children.length === 0) {
                searchResultsContainerEle.innerHTML = "<div class=\"message is-info\">" +
                  "<div class=\"message-body\">" +
                  "<p>There are no new files in DocuShare that meet your search criteria.</p>" +
                  "</div>" +
                  "</div>";

              } else {

                searchResultsContainerEle.appendChild(panelEle);
              }
            });
        };

        cityssm.openHtmlModal("docushare-url-add", {
          onshow: () => {

            searchResultsContainerEle = document.getElementById("container--addDocuShareURL");

            searchFormEle = document.getElementById("form--addDocuShareURL-search") as HTMLFormElement;
            searchFormEle.addEventListener("submit", searchDocuShareFn);

            const collectionSelectEle = document.getElementById("addDocuShareURL--collectionHandleIndex") as HTMLSelectElement;

            for (let index = 0; index < exports.docuShareCollectionHandles.length; index += 1) {
              const optionEle = document.createElement("option");
              optionEle.value = index.toString();
              optionEle.innerText = exports.docuShareCollectionHandles[index].title;
              collectionSelectEle.appendChild(optionEle);

              if (index === 0) {
                collectionSelectEle.value = index.toString();
              }
            }

            collectionSelectEle.addEventListener("change", searchDocuShareFn);

            const searchStringEle = document.getElementById("addDocuShareURL--searchString") as HTMLInputElement;
            searchStringEle.value = (document.getElementById("record--recordNumber") as HTMLInputElement).value;

            searchDocuShareFn();
          },
          onhidden: () => {
            if (doRefreshOnClose) {
              getURLs();
            }
          }
        });
      });
    }

    renderURLsFn(exports.recordURLs);
    delete exports.recordURLs;
  }

  /*
   * Related Records
   */

  {
    const relatedRecordPanelEle = document.getElementById("panel--relatedRecords");
  }

  /*
   * Comments
   */

  {
    const commentPanelEle = document.getElementById("panel--comments");

    const renderCommentsFn = (comments: recordTypes.RecordComment[]) => {
      clearPanelBlocksFn(commentPanelEle);

    };

    renderCommentsFn(exports.recordComments);
    delete exports.recordComments;
  }
})();
