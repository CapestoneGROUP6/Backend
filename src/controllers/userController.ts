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

    await prisma.user.update({
      where: {
        ID: user!.ID
      },
      data: {
        ...details
      }
    })
    res.json({ status: true, user });
  } catch (error) {
    res.json({
      status: false,
    });
  }
};
