import type * as docuShareTypes from "@cityssm/docushare/types";
export declare const searchDocuShare: (parentCollectionHandle: string, searchString: string) => Promise<docuShareTypes.DocuShareObject[]>;
export default searchDocuShare;
