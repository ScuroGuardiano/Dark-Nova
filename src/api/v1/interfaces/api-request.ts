import { Request } from "express";
import { SessionManager } from "server-sessions";
import User from "@db/models/user";

export default interface APIRequest extends Request {
    sessionManager: SessionManager<{ userId: string }>;
}
