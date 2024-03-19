import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../customTypes";
import { PrismaClient, user } from "@prisma/client";

const prisma = new PrismaClient()

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


export const modifyProfile = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const details = req.body as user

    if (!user) {
      res.json({ status: false });
    }

    const newDetails = await prisma.user.update({
      where: {
        ID: user!.ID
      },
      data: {
        ...details
      }
    })
    const {PASSWORD, OTP, ROLE, GOOGLE_ID, ...rest} = newDetails
    res.json({ status: true, user: {...rest} });
  } catch (error) {
    console.log(error)
    res.json({
      status: false,
    });
  }
};
