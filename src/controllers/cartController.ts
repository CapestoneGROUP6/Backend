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

export const updateCartDetails = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { ID } = req.user!;
        const { itemid, count } = req.body;

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
                    count
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

