import type * as recordTypes from "../../types/recordTypes";
export interface CRMAdmin {
    getLoadingHTML: (sectionName: string) => string;
    isValidRegex: (possibleRegexString: string) => boolean;
    recordTypes?: recordTypes.RecordType[];
    getUsersFunction?: () => void;
    getRecordTypesFunction?: (callbackFunction?: () => void) => void;
    getStatusTypesFunction?: () => void;
}
