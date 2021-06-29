import type * as recordTypes from "./recordTypes";

export interface CRM {

  getRecordType: (recordTypeKey: string) => recordTypes.RecordType;

  renderRecordPanelLinkEle: (record: recordTypes.Record, options: {
    panelTag: "a" | "div";
    includeAddButton?: boolean;
    includeRemoveButton?: boolean;
  }) => HTMLElement;
}
