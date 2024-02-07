import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../customTypes";

export const userProfile = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    res.json({ status: true, user });
  } catch (error) {
    res.json({
      status: false,
    });
  }
};
