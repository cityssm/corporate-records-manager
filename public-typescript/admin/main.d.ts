import type * as recordTypes from "../../types/recordTypes";
export interface CRMAdmin {
    getLoadingHTML: (sectionName: string) => string;
    isValidRegex: (possibleRegexString: string) => boolean;
    recordTypes?: recordTypes.RecordType[];
    getUsersFn?: () => void;
    getRecordTypesFn?: (callbackFn?: () => void) => void;
    getStatusTypesFn?: () => void;
}
