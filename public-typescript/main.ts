import type * as recordTypes from "../types/recordTypes";


document.getElementById("navbar-burger").addEventListener("click", (clickEvent) => {

  clickEvent.preventDefault();

  const toggleButtonEle = clickEvent.currentTarget as HTMLElement;
  const menuEle = document.getElementById("navbar-menu");

  menuEle.classList.toggle("is-active");

  if (menuEle.classList.contains("is-active")) {
    toggleButtonEle.setAttribute("aria-expanded", "true");
    toggleButtonEle.classList.add("is-active");
  } else {
    toggleButtonEle.setAttribute("aria-expanded", "false");
    toggleButtonEle.classList.remove("is-active");
  }
});


(() => {

  const recordTypeMap = new Map<string, recordTypes.RecordType>();

  for (const recordType of exports.recordTypes) {
    recordTypeMap.set(recordType.recordTypeKey, recordType);
  }

  exports.getRecordType = (recordType: string) => {
    return recordTypeMap.get(recordType);
  };
})();
