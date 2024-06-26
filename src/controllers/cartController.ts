import { NextFunction, Response } from "express";
import { CustomRequest } from "../customTypes";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUserCart = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { ID } = req.user!;

        const details = await prisma.cart.findMany({
            where: {
                userid: +ID
            }
        })

        let cartWithProductDEtails = [];
        for (let i = 0; i < details.length; i++) {
            const { itemid, count, id, userid } = details[i]
            const productDetails = await prisma.items.findFirst({
                where: {
                    ID: +itemid
                }
            })
            if (productDetails) {
                cartWithProductDEtails.push({
                    itemid, count, id, userid, productDetails
                })
            }
        }
        return res.json(cartWithProductDEtails);
    } catch (error) {
        res.json({
            status: false,
        });
    }
};


export const clearCart = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { ID } = req.user!;

        const details = await prisma.cart.deleteMany({
            where: {
                userid: +ID
            }
        })
        return res.json({ status: true });
    } catch (error) {
        res.json({
            status: false,
        });
    }
};

export const updateCartDetails = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { ID } = req.user!;
        const { itemid, count } = req.body;

        const productinformation = await prisma.items.findFirst({
            where: {
                ID: +itemid
            }
        })
        if (!productinformation) {
            res.status(400).json({ status: false, message: "Item Not found" });
        }

        const cartItem = await prisma.cart.findFirst({
            where: {
                userid: +ID,
                itemid: +itemid
            }
        });

        if (!cartItem && count > 0) {
            await prisma.cart.create({
                data: {
                    userid: +ID,
                    itemid: +itemid,
                    count,
                    unitprice: productinformation!.PRICE as any,
                    itemname: productinformation!.NAME
                }
            });
            return res.json({ status: true, message: "Cart Updated." });
        }

        if (count === 0 && cartItem) {
            await prisma.cart.delete({
                where: {
                    id: cartItem.id,
                    itemid: +itemid
                }
            });
            return res.json({ status: true, message: "Cart item deleted." });
        }

        await prisma.cart.update({
            where: {
                id: cartItem!.id
            },
            data: {
                count: count
            }
        });

        return res.json({ status: true });
    } catch (error) {
        res.status(500).json({ status: false, message: "Internal server error." });
    }
};

export const getProductInfoFromCart = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const { ID } = req.user!;

        const details = await prisma.cart.findFirst({
            where: {
                userid: +ID,
                itemid: +id
            }
        })
        return res.json({
            count: details?.count || 0
        });

    } catch (error) {
        res.json({
            status: false,
        });
    }
};
