export interface CRMEdit {
    recordID: string;
    getLoadingPanelBlockHTML: (sectionName: string) => string;
    clearPanelBlocksFn: (panelEle: HTMLElement) => void;
}
