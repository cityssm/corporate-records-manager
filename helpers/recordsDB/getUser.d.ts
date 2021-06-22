import type { User } from "../../types/recordTypes";
export declare const getUser: (userName: string, filterByIsActive?: boolean) => Promise<User>;
export default getUser;
