export interface User {
  userName: string;
  canUpdate: boolean;
  isAdmin: boolean;
};


declare module "express-session" {
  interface Session {
    user: User;
  }
};
