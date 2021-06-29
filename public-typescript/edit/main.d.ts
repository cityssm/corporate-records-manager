export interface CRMEdit {
    recordID: string;
    getLoadingPanelBlockHTML: (sectionName: string) => string;
    clearPanelBlocksFunction: (panelEle: HTMLElement) => void;
}
