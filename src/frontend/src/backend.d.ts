import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Investment {
    id: bigint;
    name: string;
    type: InvestmentType;
    amount: number;
}
export interface UserProfile {
    name: string;
}
export enum InvestmentType {
    realEstate = "realEstate",
    bond = "bond",
    cash = "cash",
    stock = "stock",
    crypto = "crypto"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createInvestmentRecord(name: string, amount: number, type: InvestmentType): Promise<Investment>;
    deleteInvestmentRecord(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listInvestmentRecords(): Promise<Array<Investment>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateInvestmentRecord(id: bigint, name: string, amount: number, type: InvestmentType): Promise<Investment>;
}
