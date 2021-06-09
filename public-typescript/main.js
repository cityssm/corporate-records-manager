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
    var recordTypeMap = new Map();
    for (var _i = 0, _a = exports.recordTypes; _i < _a.length; _i++) {
        var recordType = _a[_i];
        recordTypeMap.set(recordType.recordTypeKey, recordType);
    }
    exports.getRecordType = function (recordType) {
        return recordTypeMap.get(recordType);
    };
})();
