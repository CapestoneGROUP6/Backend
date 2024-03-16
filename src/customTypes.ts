import { user } from "@prisma/client";
import { Request } from "express";

export interface CustomRequest extends Request {
  user?: user;
  checkAdmin?: boolean
}
