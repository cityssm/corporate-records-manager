interface SuggestedRecordUser {
    fullName: string;
    userName: string;
    recordCount: number;
}
export declare const getSuggestedRecordUsers: () => Promise<SuggestedRecordUser[]>;
export default getSuggestedRecordUsers;
