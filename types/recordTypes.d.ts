export interface User {
    userName: string;
    canUpdate: boolean;
    isAdmin: boolean;
}
export declare type SessionUser = User;
declare module "express-session" {
    interface Session {
        user: SessionUser;
    }
}
