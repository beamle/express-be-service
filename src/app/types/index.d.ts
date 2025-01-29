import { MeViewModel } from "../db";

declare global {
  namespace Express {
    export interface Request {
      context: { user: MeViewModel | null }
    }
  }
}