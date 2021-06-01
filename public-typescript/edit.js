"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(function () {
    var urlPrefix = exports.urlPrefix;
    var recordID = document.getElementById("record--recordID").value;
    {
        var statusPanelEle = document.getElementById("panel--statuses");
        var renderStatusesFn = function (statuses) {
        };
        renderStatusesFn(exports.recordStatuses);
        delete exports.recordStatuses;
    }
    {
        var urlPanelEle = document.getElementById("panel--urls");
        var renderURLsFn = function (urls) {
        };
        renderURLsFn(exports.recordURLs);
        delete exports.recordURLs;
    }
    {
        var relatedRecordPanelEle = document.getElementById("panel--relatedRecords");
    }
    {
        var commentPanelEle = document.getElementById("panel--comments");
        var renderCommentsFn = function (urls) {
        };
        renderCommentsFn(exports.recordComments);
        delete exports.recordComments;
    }
})();
