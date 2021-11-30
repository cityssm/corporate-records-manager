export interface CRMEdit {
    recordID: string;
    getLoadingPanelBlockHTML: (sectionName: string) => string;
    clearPanelBlocksFunction: (panelElement: HTMLElement) => void;
}
