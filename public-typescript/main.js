"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const urlPrefix = exports.urlPrefix;
    const recordTypeMap = new Map();
    for (const recordType of exports.recordTypes) {
        recordTypeMap.set(recordType.recordTypeKey, recordType);
    }
    const getRecordType = (recordTypeKey) => {
        return recordTypeMap.get(recordTypeKey);
    };
    const currentDate = new Date();
    currentDate.setHours(0);
    currentDate.setMinutes(0);
    currentDate.setSeconds(0);
    currentDate.setMilliseconds(0);
    const crm = {
        getRecordType,
        renderRecordPanelLinkEle: (record, options) => {
            const recordType = getRecordType(record.recordTypeKey);
            const panelBlockElement = document.createElement(options.panelTag);
            panelBlockElement.className = "panel-block is-block";
            const url = urlPrefix + "/view/" + record.recordID.toString();
            let recordNumberHTML = "";
            if (options.panelTag === "a") {
                panelBlockElement.href = url;
                recordNumberHTML = "<strong>" + recordType.recordType + " " + cityssm.escapeHTML(record.recordNumber) + "</strong>";
            }
            else {
                recordNumberHTML = "<a class=\"has-text-weight-bold\" href=\"" + cityssm.escapeHTML(url) + "\" target=\"_blank\"> " +
                    recordType.recordType + " " + cityssm.escapeHTML(record.recordNumber) +
                    "</a>";
            }
            const recordDate = new Date(record.recordDate);
            const timeAgo = dateDiff(recordDate, currentDate);
            panelBlockElement.innerHTML = "<div class=\"columns mb-0\">" +
                ("<div class=\"column pb-0\">" +
                    recordNumberHTML +
                    (record.recordTitle !== "" && record.recordTitle !== record.recordNumber
                        ? "<br />" +
                            "<span class=\"has-tooltip-right has-tooltip-arrow\" data-tooltip=\"Title\">" +
                            cityssm.escapeHTML(record.recordTitle) +
                            "</span>"
                        : "") +
                    "</div>") +
                (record.recordDate
                    ? "<div class=\"column is-narrow pb-0 has-text-right\">" +
                        (timeAgo.inDays === 0
                            ? "<strong class=\"has-tooltip-left has-tooltip-arrow\" data-tooltip=\"Today\">" +
                                cityssm.dateToString(recordDate) +
                                "</strong>"
                            : "<span class=\"has-tooltip-left has-tooltip-arrow\" data-tooltip=\"" + cityssm.escapeHTML(timeAgo.formatted) + " ago\">" +
                                cityssm.dateToString(recordDate) +
                                "</span>") +
                        "</div>"
                    : "") +
                (options.includeAddButton || options.includeRemoveButton
                    ? "<div class=\"column is-narrow pb-0\">" +
                        (options.includeAddButton
                            ? "<button class=\"button is-success is-small has-tooltip-arrow has-tooltip-left\" data-tooltip=\"Add Record\" type=\"button\">" +
                                "<span class=\"icon\"><i class=\"fas fa-plus\" aria-hidden=\"true\"></i></span>" +
                                "</button>"
                            : "") +
                        (options.includeRemoveButton
                            ? "<button class=\"button is-danger is-light is-small has-tooltip-arrow has-tooltip-left\" data-tooltip=\"Remove Record\" type=\"button\">" +
                                "<span class=\"icon\"><i class=\"fas fa-trash-alt\" aria-hidden=\"true\"></i></span>" +
                                "</button>"
                            : "") +
                        "</div>"
                    : "") +
                "</div>" +
                ("<div class=\"is-size-7\">" +
                    (record.party && record.party !== ""
                        ? "<span class=\"has-tooltip-right has-tooltip-arrow\" data-tooltip=\"Related Party\">" +
                            "<span class=\"icon\"><i class=\"fas fa-users\" aria-hidden=\"true\"></i></span> " +
                            cityssm.escapeHTML(record.party) +
                            "</span><br />"
                        : "") +
                    (record.location && record.location !== ""
                        ? "<span class=\"has-tooltip-right has-tooltip-arrow\" data-tooltip=\"Location\">" +
                            "<span class=\"icon\"><i class=\"fas fa-map-marker-alt\" aria-hidden=\"true\"></i></span> " +
                            cityssm.escapeHTML(record.location) +
                            "</span><br />"
                        : "") +
                    cityssm.escapeHTML(record.recordDescription.length > 500
                        ? record.recordDescription.slice(0, 497) + " ..."
                        : record.recordDescription) + "<br />" +
                    (record.statusTypeKey && record.statusTypeKey !== ""
                        ? "<span class=\"tag has-tooltip-right has-tooltip-arrow\" data-tooltip=\"Current Status\">" +
                            record.statusType + " " + cityssm.dateToString(new Date(record.statusTime)) +
                            "</span>"
                        : "") +
                    "</div>");
            return panelBlockElement;
        }
    };
    exports.crm = crm;
})();
