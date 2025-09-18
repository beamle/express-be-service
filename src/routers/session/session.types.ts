import { UserSessionDBType } from "../../app/db";

export type SessionMeta = Omit<UserSessionDBType, "_id">;
