import type * as recordTypes from "../types/recordTypes";
import type * as dsTypes from "@cityssm/docushare/types";

import type { cityssmGlobal } from "@cityssm/bulma-webapp-js/src/types";
declare const cityssm: cityssmGlobal;


(() => {
  const urlPrefix: string = exports.urlPrefix;
  const recordID = (document.getElementById("record--recordID") as HTMLInputElement).value;

  // const recordTypeKeyEle = document.getElementById("record--recordTypeKey") as HTMLInputElement;
  // const recordTypeKey = recordTypeKeyEle.value;
  // const recordType = recordTypeKeyEle.getAttribute("data-record-type");

  const clearPanelBlocksFn = (panelEle: HTMLElement) => {

    const panelBlockEles = panelEle.getElementsByClassName("panel-block");

    for (let index = 0; index < panelBlockEles.length; index += 1) {
      panelBlockEles[index].remove();
      index -= 1;
    }
  };

  /*
   * Statuses
   */

  const statusPanelEle = document.getElementById("panel--statuses");

  if (statusPanelEle) {

    let statuses: recordTypes.RecordStatus[] = exports.recordStatuses;
    delete exports.recordStatuses;

    const openEditStatusModalFn = (clickEvent: MouseEvent) => {

      clickEvent.preventDefault();

      const panelBlockEle = (clickEvent.currentTarget as HTMLElement).closest(".panel-block");

      const index = parseInt(panelBlockEle.getAttribute("data-index"), 10);
      const status = statuses[index];

      let closeEditModalFn: () => void;

      const editFn = (formEvent: Event) => {
        formEvent.preventDefault();

        cityssm.postJSON(urlPrefix + "/edit/doUpdateStatus",
          formEvent.currentTarget,
          (responseJSON: { success: boolean; message?: string }) => {

            if (responseJSON.success) {
              getStatuses();
              closeEditModalFn();
            } else {
              cityssm.alertModal("Update Status Error",
                cityssm.escapeHTML(responseJSON.message),
                "OK",
                "danger");
            }
          });
      };

      cityssm.openHtmlModal("status-edit", {
        onshow: () => {

          (document.getElementById("editStatus--statusLogID") as HTMLInputElement).value = status.statusLogID.toString();

          const statusTypeKeyEle = document.getElementById("editStatus--statusTypeKey") as HTMLSelectElement;
          const statusTypes: recordTypes.StatusType[] = exports.statusTypes;

          let statusTypeKeyFound = false;

          for (const statusType of statusTypes) {

            if (statusType.isActive || statusType.statusTypeKey === status.statusTypeKey) {
              statusTypeKeyEle.insertAdjacentHTML("beforeend",
                "<option value=\"" + cityssm.escapeHTML(statusType.statusTypeKey) + "\">" +
                cityssm.escapeHTML(statusType.statusType) +
                "</option>");

              if (statusType.statusTypeKey === status.statusTypeKey) {
                statusTypeKeyFound = true;
              }
            }
          }

          if (!statusTypeKeyFound) {
            statusTypeKeyEle.insertAdjacentHTML("beforeend",
              "<option value=\"" + cityssm.escapeHTML(status.statusTypeKey) + "\">" +
              cityssm.escapeHTML(status.statusTypeKey) +
              "</option>");
          }

          statusTypeKeyEle.value = status.statusTypeKey;

          const statusTime = new Date(status.statusTime);
          (document.getElementById("editStatus--statusDateString") as HTMLInputElement).value = cityssm.dateToString(statusTime);
          (document.getElementById("editStatus--statusTimeString") as HTMLInputElement).value = cityssm.dateToTimeString(statusTime);

          (document.getElementById("editStatus--statusLog") as HTMLTextAreaElement).value = status.statusLog;

          document.getElementById("form--editStatus").addEventListener("submit", editFn);
        },
        onshown: (_modalEle, closeModalFn) => {
          closeEditModalFn = closeModalFn;
        }
      });
    };

    const openRemoveStatusModalFn = (clickEvent: MouseEvent) => {

      clickEvent.preventDefault();

      const panelBlockEle = (clickEvent.currentTarget as HTMLElement).closest(".panel-block");

      const index = parseInt(panelBlockEle.getAttribute("data-index"), 10);
      const status = statuses[index];

      const removeFn = () => {

        cityssm.postJSON(urlPrefix + "/edit/doRemoveStatus", {
          statusLogID: status.statusLogID
        }, (responseJSON: { success: boolean; message?: string }) => {

          if (responseJSON.success) {
            statuses.splice(index, 1);
            clearPanelBlocksFn(statusPanelEle);
            renderStatusesFn();

          } else {
            cityssm.alertModal("Remove Status Error",
              cityssm.escapeHTML(responseJSON.message),
              "OK",
              "danger");
          }
        });
      };

      cityssm.confirmModal("Remove Status",
        "Are you sure you want to remove this status?<br />" +
        "If the status of this record has changed, it would be better to add a new status.",
        "Yes, Remove the Status",
        "warning",
        removeFn);
    };

    const renderStatusFn = (status: recordTypes.RecordStatus, index: number) => {

      const panelBlockEle = document.createElement("div");
      panelBlockEle.className = "panel-block is-block";
      panelBlockEle.setAttribute("data-status-log-id", status.statusLogID.toString());
      panelBlockEle.setAttribute("data-index", index.toString());

      const statusType: recordTypes.StatusType = exports.statusTypes.find((possibleStatusType: recordTypes.StatusType) => {
        return possibleStatusType.statusTypeKey === status.statusTypeKey;
      });

      const statusTime = new Date(status.statusTime);

      panelBlockEle.innerHTML = "<div class=\"columns\">" +
        ("<div class=\"column\">" +
          "<strong>" + cityssm.escapeHTML(statusType ? statusType.statusType : status.statusTypeKey) + "</strong><br />" +
          "<span class=\"has-tooltip-arrow has-tooltip-right\" data-tooltip=\"" + cityssm.dateToTimeString(statusTime) + "\">" + cityssm.dateToString(statusTime) + "</span><br />" +
          "<span class=\"is-size-7\">" + cityssm.escapeHTML(status.statusLog) + "</span>" +
          "</div>") +
        ("<div class=\"column is-narrow\">" +
          "<button class=\"button is-info is-light is-small\" type=\"button\">" +
          "<span class=\"icon\"><i class=\"fas fa-pencil-alt\" aria-hidden=\"true\"></i></span>" +
          "<span>Edit</span>" +
          "</button>" +
          " <button class=\"button is-danger is-light is-small has-tooltip-arrow has-tooltip-left\" data-tooltip=\"Remove Status\" type=\"button\">" +
          "<span class=\"icon\"><i class=\"fas fa-trash-alt\" aria-hidden=\"true\"></i></span>" +
          "</button>" +
          "</div>") +
        "</div>";

      const buttonEles = panelBlockEle.getElementsByTagName("button");
      buttonEles[0].addEventListener("click", openEditStatusModalFn);
      buttonEles[1].addEventListener("click", openRemoveStatusModalFn);

      statusPanelEle.appendChild(panelBlockEle);
    };

    const renderStatusesFn = () => {
      clearPanelBlocksFn(statusPanelEle);

      clearPanelBlocksFn(statusPanelEle);

      if (statuses.length === 0) {
        statusPanelEle.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
          "<div class=\"message is-warning\">" +
          "<div class=\"message-body\">There are no statuses associated with this record.</div>" +
          "</div>" +
          "</div>");

        return;
      }

      statuses.forEach(renderStatusFn);
    };

    const getStatuses = () => {

      clearPanelBlocksFn(statusPanelEle);
      statuses = [];

      statusPanelEle.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block has-text-centered has-text-grey\">" +
        "<i class=\"fas fa-4x fa-spinner fa-pulse\" aria-hidden=\"true\"></i><br />" +
        "Loading Statuses..." +
        "</div>");

      cityssm.postJSON(urlPrefix + "/view/doGetStatuses", {
        recordID
      },
        (responseJSON: { success: boolean; statuses: recordTypes.RecordStatus[]; message?: string }) => {

          if (responseJSON.success) {
            statuses = responseJSON.statuses;
            renderStatusesFn();
          } else {

            statusPanelEle.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
              "<div class=\"message is-danger\"><div class=\"message-body\">" +
              responseJSON.message +
              "</div></div>" +
              "</div>");
          }
        });
    };

    renderStatusesFn();

    const addStatusButtonEle = document.getElementById("is-add-status-button");

    if (addStatusButtonEle) {

      addStatusButtonEle.addEventListener("click", () => {

        let closeAddModalFn: () => void;

        const addFn = (formEvent: Event) => {
          formEvent.preventDefault();

          cityssm.postJSON(urlPrefix + "/edit/doAddStatus",
            formEvent.currentTarget,
            (responseJSON: { success: boolean; message?: string }) => {

              if (responseJSON.success) {
                getStatuses();
                closeAddModalFn();
              } else {
                cityssm.alertModal("Add Status Error",
                  cityssm.escapeHTML(responseJSON.message),
                  "OK",
                  "danger");
              }
            });
        };

        cityssm.openHtmlModal("status-add", {
          onshow: () => {
            (document.getElementById("addStatus--recordID") as HTMLInputElement).value = recordID;

            const statusTypeKeyEle = document.getElementById("addStatus--statusTypeKey") as HTMLSelectElement;
            const statusTypes: recordTypes.StatusType[] = exports.statusTypes;

            for (const statusType of statusTypes) {

              if (statusType.isActive) {
                statusTypeKeyEle.insertAdjacentHTML("beforeend",
                  "<option value=\"" + cityssm.escapeHTML(statusType.statusTypeKey) + "\">" +
                  cityssm.escapeHTML(statusType.statusType) +
                  "</option>");
              }
            }

            const rightNow = new Date();
            (document.getElementById("addStatus--statusDateString") as HTMLInputElement).value = cityssm.dateToString(rightNow);
            (document.getElementById("addStatus--statusTimeString") as HTMLInputElement).value = cityssm.dateToTimeString(rightNow);

            document.getElementById("form--addStatus").addEventListener("submit", addFn);
          },
          onshown: (_modalEle, closeModalFn) => {
            closeAddModalFn = closeModalFn;
          }
        });
      });
    }
  }

  /*
   * URLs
   */

  {
    let urls: recordTypes.RecordURL[] = exports.recordURLs;
    delete exports.recordURLs;

    const urlPanelEle = document.getElementById("panel--urls");

    const openEditURLModalFn = (clickEvent: MouseEvent) => {

      clickEvent.preventDefault();

      const panelBlockEle = (clickEvent.currentTarget as HTMLElement).closest(".panel-block");

      const index = parseInt(panelBlockEle.getAttribute("data-index"), 10);
      const url = urls[index];

      let closeEditModalFn: () => void;

      const editFn = (formEvent: Event) => {
        formEvent.preventDefault();

        cityssm.postJSON(urlPrefix + "/edit/doUpdateURL",
          formEvent.currentTarget,
          (responseJSON: { success: boolean; message?: string }) => {

            if (responseJSON.success) {
              getURLs();
              closeEditModalFn();
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
          (document.getElementById("editURL--urlID") as HTMLInputElement).value = url.urlID.toString();
          (document.getElementById("editURL--url") as HTMLInputElement).value = url.url;
          (document.getElementById("editURL--urlTitle") as HTMLInputElement).value = url.urlTitle;
          (document.getElementById("editURL--urlDescription") as HTMLInputElement).value = url.urlDescription;

          document.getElementById("form--editURL").addEventListener("submit", editFn);
        },
        onshown: (_modalEle, closeModalFn) => {
          closeEditModalFn = closeModalFn;
        }
      });
    };

    const openRemoveURLModalFn = (clickEvent: MouseEvent) => {

      clickEvent.preventDefault();

      const panelBlockEle = (clickEvent.currentTarget as HTMLElement).closest(".panel-block");

      const index = parseInt(panelBlockEle.getAttribute("data-index"), 10);
      const url = urls[index];

      const removeFn = () => {

        cityssm.postJSON(urlPrefix + "/edit/doRemoveURL", {
          urlID: url.urlID
        }, (responseJSON: { success: boolean; message?: string }) => {

          if (responseJSON.success) {
            urls.splice(index, 1);
            clearPanelBlocksFn(urlPanelEle);
            renderURLsFn();

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
        removeFn);
    };

    const renderURLFn = (url: recordTypes.RecordURL, index: number) => {

      const panelBlockEle = document.createElement("div");
      panelBlockEle.className = "panel-block is-block";
      panelBlockEle.setAttribute("data-url-id", url.urlID.toString());
      panelBlockEle.setAttribute("data-index", index.toString());

      panelBlockEle.innerHTML = "<div class=\"columns\">" +
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

      const buttonEles = panelBlockEle.getElementsByTagName("button");
      buttonEles[0].addEventListener("click", openEditURLModalFn);
      buttonEles[1].addEventListener("click", openRemoveURLModalFn);

      urlPanelEle.appendChild(panelBlockEle);
    };

    const renderURLsFn = () => {

      clearPanelBlocksFn(urlPanelEle);

      if (urls.length === 0) {
        urlPanelEle.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
          "<div class=\"message is-info\">" +
          "<div class=\"message-body\">There are no links associated with this record.</div>" +
          "</div>" +
          "</div>");

        return;
      }

      urls.forEach(renderURLFn);
    };

    const getURLs = () => {

      clearPanelBlocksFn(urlPanelEle);
      urls = [];

      urlPanelEle.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block has-text-centered has-text-grey\">" +
        "<i class=\"fas fa-4x fa-spinner fa-pulse\" aria-hidden=\"true\"></i><br />" +
        "Loading Links..." +
        "</div>");

      cityssm.postJSON(urlPrefix + "/view/doGetURLs", {
        recordID
      },
        (responseJSON: { success: boolean; urls: recordTypes.RecordURL[]; message?: string }) => {

          if (responseJSON.success) {
            urls = responseJSON.urls;
            renderURLsFn();
          } else {

            urlPanelEle.insertAdjacentHTML("beforeend", "<div class=\"panel-block is-block\">" +
              "<div class=\"message is-danger\"><div class=\"message-body\">" +
              responseJSON.message +
              "</div></div>" +
              "</div>");
          }
        });
    };

    renderURLsFn();

    document.getElementById("is-add-url-button").addEventListener("click", () => {

      let closeAddModalFn: () => void;

      const addFn = (formEvent: Event) => {
        formEvent.preventDefault();

        cityssm.postJSON(urlPrefix + "/edit/doAddURL",
          formEvent.currentTarget,
          (responseJSON: { success: boolean; message?: string }) => {

            if (responseJSON.success) {
              getURLs();
              closeAddModalFn();
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
          (document.getElementById("addURL--recordID") as HTMLInputElement).value = recordID;

          document.getElementById("form--addURL").addEventListener("submit", addFn);
        },
        onshown: (_modalEle, closeModalFn) => {
          closeAddModalFn = closeModalFn;
        }
      });
    });

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

          cityssm.postJSON(urlPrefix + "/edit/doAddDocuShareURL", {
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
