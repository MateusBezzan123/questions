import { UserType } from "@prisma/client";

declare global {
  namespace Express {
    interface User {
      userId: string;
      type: UserType;
    }

    interface Request {
      user?: User;
    }
  }
}