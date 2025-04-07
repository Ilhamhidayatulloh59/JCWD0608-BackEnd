import "express";

export type UserPayload = {
  id: number;
  role: "admin" | "user";
};

declare global {
  namespace Express {
    export interface Request {
      user?: UserPayload;
    }
  }
}
