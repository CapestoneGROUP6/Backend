import { NextFunction, Response } from "express";
import { CustomRequest } from "../customTypes";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllProducts = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { categoryId } = req.query
        const where = {
            IsAdminApproved: 1
        } as any
        if (categoryId) {
            where.Category_ID = +categoryId
        }

        const response = await prisma.items.findMany({
            where
        })
        return res.json(response);
    } catch (error) {
        console.log(error)
        res.json({
            status: false,
        });
    }
};


export const getProductDetails = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const details = await prisma.items.findFirst({
            where: {
                ID: +id
            }
        })
        return res.json({ ...details });
    } catch (error) {
        res.json({
            status: false,
        });
    }
};


export const getProductDetailsBYCategory = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const filter = {} as any
        if(id) {
            filter.where = {
                Category_ID: +id
            }
        }

        const details = await prisma.items.findMany(filter)
        return res.json(details);
    } catch (error) {
        console.log(error)
        res.json({
            status: false,
        });
    }
};


export const getPendingApprovalProducts = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const response = await prisma.items.findMany({
            where: {
                IsAdminApproved: 0
            }
        })
        return res.json(response);
    } catch (error) {
        console.log(error)
        res.json({
            status: false,
        });
    }
};

interface AddProductDEtails {
    name: string;
    price: number;
    category_id: number;
    description: string
}


interface EditProductDEtails {
    name: string;
    price: number;
    category_id: number;
    description: string;
    id: number
}


export const addProduct = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, category_id, description, price } = req.body as AddProductDEtails;
        console.log({ name, category_id, description, price })
        if (!name || !category_id || !description || !price) {
            return res.json({
                status: false,
                message: "name, category_ID, description, price are mandatory",
            });
        }

        const product = await prisma.items.create({
            data: {
                Category_ID: +category_id,
                Description: description,
                User_ID: req.user!.ID,
                IsAdminApproved: req.user?.ROLE?.toLocaleLowerCase() === 'admin' ? 1 : 0,
                PRICE: price,
                //@ts-ignore
                Image: req.files && req.files['file'] ? req.files['file'][0].filename : null,
                //@ts-ignore
                BookFile: req.files && req.files['bookFile'] ? req.files['bookFile'][0].filename : null,
                NAME: name
            }
        })

        return res.json({ status: true, product: { ...product } });
    } catch (error) {
        console.log(error)
        return res.json({
            status: false,
        });
    }
};


export const editProduct = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, category_id, description, price, id } = req.body as EditProductDEtails;

        await prisma.items.findFirst({
            where: {
                ID: +id
            }
        })

        const product = await prisma.items.update({
            where: {
                ID: +id
            },
            data: {
                Category_ID: +category_id,
                Description: description,
                User_ID: req.user!.ID,
                IsAdminApproved: req.user?.ROLE?.toLocaleLowerCase() === 'admin' ? 1 : 0,
                PRICE: price,
                Image: req.file?.filename,
                NAME: name
            }
        })

        return res.json({ status: true, product: { ...product } });
    } catch (error) {
        console.log(error)
        return res.json({
            status: false,
        });
    }
};


export const approveProduct = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.json({
                status: false,
                message: 'ProductId is required for approval'
            });
        }
        await prisma.items.update({
            where: {
                ID: +id
            },
            data: {
                IsAdminApproved: 1
            }
        })
        return res.json({ status: true, message: 'Product Approved' });
    } catch (error) {
        res.json({
            status: false,
        });
    }
};


export const rejectProduct = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.json({
                status: false,
                message: 'ProductId is required for REjection'
            });
        }
        await prisma.items.update({
            where: {
                ID: +id
            },
            data: {
                IsAdminApproved: 2
            }
        })
        return res.json({ status: true, message: 'Product REjection Successfull' });
    } catch (error) {
        res.json({
            status: false,
        });
    }
};


export const deleteProduct = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.json({
                status: false,
                message: 'ProductId is required for deletion'
            });
        }
        await prisma.items.delete({
            where: {
                ID: +id
            },
        })
        return res.json({ status: true, message: 'Product deleted Successfull' });
    } catch (error) {
        res.json({
            status: false,
        });
    }
};
