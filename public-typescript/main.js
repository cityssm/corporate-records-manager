"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
document.getElementById("navbar-burger").addEventListener("click", function (clickEvent) {
    clickEvent.preventDefault();
    var toggleButtonEle = clickEvent.currentTarget;
    var menuEle = document.getElementById("navbar-menu");
    menuEle.classList.toggle("is-active");
    if (menuEle.classList.contains("is-active")) {
        toggleButtonEle.setAttribute("aria-expanded", "true");
        toggleButtonEle.classList.add("is-active");
    }
    else {
        toggleButtonEle.setAttribute("aria-expanded", "false");
        toggleButtonEle.classList.remove("is-active");
    }
});
(function () {
    var urlPrefix = exports.urlPrefix;
    var recordTypeMap = new Map();
    for (var _i = 0, _a = exports.recordTypes; _i < _a.length; _i++) {
        var recordType = _a[_i];
        recordTypeMap.set(recordType.recordTypeKey, recordType);
    }
    var getRecordType = function (recordTypeKey) {
        return recordTypeMap.get(recordTypeKey);
    };
    var crm = {
        getRecordType: getRecordType,
        renderRecordPanelLinkEle: function (record, options) {
            var recordType = getRecordType(record.recordTypeKey);
            var panelBlockEle = document.createElement(options.panelTag);
            panelBlockEle.className = "panel-block is-block";
            var url = urlPrefix + "/view/" + record.recordID.toString();
            var recordNumberHTML = "";
            if (options.panelTag === "a") {
                panelBlockEle.href = url;
                recordNumberHTML = "<strong>" + recordType.recordType + " " + cityssm.escapeHTML(record.recordNumber) + "</strong>";
            }
            else {
                recordNumberHTML = "<a class=\"has-text-weight-bold\" href=\"" + cityssm.escapeHTML(url) + "\" target=\"_blank\"> " +
                    recordType.recordType + " " + cityssm.escapeHTML(record.recordNumber) +
                    "</a>";
            }
            panelBlockEle.innerHTML = "<div class=\"columns mb-0\">" +
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
                        cityssm.dateToString(new Date(record.recordDate)) +
                        "</div>"
                    : "") +
                (options.includeAddButton || options.includeRemoveButton
                    ? "<div class=\"column is-narrow\">" +
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
                "<div class=\"is-size-7\">" +
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
                    ? record.recordDescription.substring(0, 497) + " ..."
                    : record.recordDescription) +
                "</div>";
            return panelBlockEle;
        }
    };
    exports.crm = crm;
})();
