import { UserType } from "@prisma/client";

export interface  User {
    userId: string;
    type: UserType;
}