import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../customTypes";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addCategory = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name } = req.body || {};
        if (!name) {
            return res.json({
                status: false,
                message: "Category Name Required",
            });
        }

        const response = await prisma.category.create({
            data: {
                NAME: name
            }
        })
        return res.json({ status: true, ...response });
    } catch (error) {
        res.json({
            status: false,
        });
    }
};


export const editCategory = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, id } = req.body || {};
        if (!name || !id) {
            return res.json({
                status: false,
                message: "Category ID/ Name Required",
            });
        }

        const response = await prisma.category.update({
            where: {
                ID: +id
            },
            data: {
                NAME: name
            }
        })
        return res.json({ status: true, ...response });
    } catch (error) {
        res.json({
            status: false,
        });
    }
};


export const deleteCategory = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params || {};
        if (!id) {
            return res.json({
                status: false,
                message: "Category ID Required",
            });
        }

        const response = await prisma.category.delete({
            where: {
                ID: +id
            }
        })
        return res.json({ status: true});
    } catch (error) {
        res.json({
            status: false,
        });
    }
};


export const getCategories = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const response = await prisma.category.findMany()
        return res.json({ status: true, categories: response });
    } catch (error) {
        res.json({
            status: false,
        });
    }
};
