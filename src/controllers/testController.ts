import { NextFunction, Request, Response } from "express";
import { sendTestEmail, sendTestSMS } from "../comms/comms";

export const testSMS = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await sendTestSMS();
    res.json(response);
  } catch (error) {
    res.json(error);
  }
};

export const testEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await sendTestEmail();
    return res.json(response);
  } catch (error) {
    res.json(error);
  }
};
