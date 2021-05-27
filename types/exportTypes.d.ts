import type * as recordTypes from "./recordTypes";
import type { DateDiff } from "@cityssm/date-diff/types";
export interface ApplicationExports {
    urlPrefix: string;
    user: recordTypes.SessionUser;
    dashboard: DashboardExports;
    cache: CacheExports;
    permitView: PermitViewExports;
    permitRecent: PermitRecentExports;
    inspectionView?: InspectionViewExports;
    inspectionDeficiency?: InspectionDeficiencyExports;
    inspectionEdit?: InspectionEditExports;
    dateDiff: DateDiff;
}
export interface DashboardExports {
    init: () => void;
    selectTabByElement: (tabEle: HTMLAnchorElement) => void;
    selectTabByClick: (clickEvent: Event) => void;
    closeTabByArticleClick: (clickEvent: Event) => void;
    toggleNavBlocker: () => void;
    tabsContainerEle: HTMLUListElement;
    articlesContainerEle: HTMLElement;
    setFormControlIDs: (articleEle: HTMLElement) => string;
    homeTabEleID: string;
    searchTabEleID: string;
}
export interface CacheExports {
    loadInspectionCache: (callbackFn: () => void) => void;
    loadPermitCache: (callbackFn: () => void) => void;
    getCacheList: (cacheName: CacheNames) => any[];
    getEmployee: (userName: string) => recordTypes.Employee;
    getPermitType: (permitTypeID: number) => recordTypes.PermitType;
    getBuildingCode: (buildingCode: string) => recordTypes.BuildingCode;
    getInspectionRequestTime: (inspectionRequestTimeID: number) => recordTypes.InspectionRequestTime;
    getInspectionCheckOption: (checkOptionID: number) => recordTypes.InspectionCheckOption;
    getInspectionStatus: (inspectionStatusID: number) => recordTypes.InspectionStatus;
    getInspectionNotificationType: (inspectionNotificationTypeID: number) => recordTypes.InspectionNotificationType;
    getInspectionTypeName: (inspectionTypeID: number) => recordTypes.InspectionTypeName;
    getInspectionType: (inspectionTypeID: number, callbackFn: (inspectionType: recordTypes.InspectionType) => void) => void;
}
export declare type CacheNames = "employees" | "inspectionCheckOptions" | "inspectionNotificationTypes" | "inspectionStatusTypes";
export interface CacheDefinition<K, V> {
    readonly list: V[];
    readonly map?: Map<K, V>;
}
export interface PermitViewExports {
    openPermitByID: (permitID: number, doSelect: boolean) => void;
    openPermitByClick: (clickEvent: Event) => void;
    getPermitTabID: (permitID: number) => string;
}
export interface PermitRecentExports {
    addPermitToList: (permit: recordTypes.BuildingPermit) => void;
}
export interface InspectionViewExports {
    openInspectionByID: (inspectionID: number) => void;
    openInspectionByClick: (clickEvent: Event) => void;
    getInspectionTabID: (inspectionID: number) => string;
    getInspectionArticleID: (inspectionID: number) => string;
}
export interface InspectionEditExports {
    switchInspectionToEditMode: (inspection: recordTypes.BuildingInspection) => void;
}
export interface InspectionDeficiencyExports {
    openInspectionDeficiencies: (permit: recordTypes.BuildingPermit, doSelect: boolean) => void;
}
