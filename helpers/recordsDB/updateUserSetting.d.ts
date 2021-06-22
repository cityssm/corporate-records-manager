export declare type FieldName = "isActive" | "canUpdate" | "isAdmin";
export declare const updateUserSetting: (userName: string, fieldName: FieldName, fieldValue: boolean) => Promise<boolean>;
export default updateUserSetting;
