import { NextFunction, Response } from "express";
import { CustomRequest } from "../customTypes";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllUsers = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { ID } = req.user!;
        const details = await prisma.user.findMany({
            where: {
                ROLE: 'regular'
            },
            select:{
                ID: true,
                NAME: true,
                EMAIL: true,
                disabled: true,
                MOBILE: true
            }
        })

        return res.json(details);
    } catch (error) {
        res.json([]);
    }
};


export const enableUser = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params
        const { ID } = req.user!;

        const details = await prisma.user.update({
            where: {
                ID: +id
            },
            data: {
                disabled: 0
            }
        })

        return res.json({ status: !!details?.ID });
    } catch (error) {
        res.json({});
    }
};


export const disableUser = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params
        const { ID } = req.user!;

        const details = await prisma.user.update({
            where: {
                ID: +id
            },
            data: {
                disabled: 1
            }
        })

        return res.json({ status: !!details?.ID });
    } catch (error) {
        res.json({});
    }
};