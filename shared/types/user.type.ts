export enum UserRole {
    ADMIN = "ADMIN",
    SELLER = "SELLER",
    MANAGER = "MANAGER",
}



export interface DecodedToken {
    id: string;
    role: UserRole;
    username: string;
}