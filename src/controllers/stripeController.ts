import { NextFunction } from "connect";
import { Request, Response } from "express";
import { CustomRequest } from "../customTypes";
import stripeFn from 'stripe';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const stripe = new stripeFn(process.env.STRIPE_KEY || '')

export const createStripeSession = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { user } = req;
        if (!user) {
            return res.status(401)
        }

        const { EMAIL, ID } = user;

        let stripecustomerid = user.stripecustomerid;
        if (!stripecustomerid) {
            const response = await stripe.customers.create({
                email: EMAIL!
            },
                {
                    apiKey: process.env.STRIPE_KEY,
                    stripeAccount: 'acct_1P0dXeK6WzhOXkMt'
                })
            const { id } = response
            stripecustomerid = id;
            await prisma.user.update({
                where: {
                    ID
                },
                data: {
                    stripecustomerid: id
                }
            })
        }

        const cartDetails = await prisma.cart.findMany({
            where: {
                userid: +user!.ID
            }
        })

        const lineItems = cartDetails.map(item => {
            return {
                price_data: {
                    currency: 'CAD',
                    product_data: {
                        name: item.itemname,
                    },
                    unit_amount: 2000
                },
                quantity: 1
            }
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems as any,
            mode: 'payment',
            success_url: `https://bookbazar.z9.web.core.windows.net/checkout?payment=success`,
            cancel_url: `https://bookbazar.z9.web.core.windows.net/checkout?payment=success`,
            customer_email: EMAIL!,
        });

        console.log({
            id: session.id
        })

        res.json({
            id: session.id
        });
    } catch (error) {
        console.log(error)
        res.json({})
    }
}

export const stripeWebhook = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const payload = req.body;
        const sig = req.headers['stripe-signature'];
        console.log(payload)

        if (payload.type === 'checkout.session.completed') {
            const customerEmail = payload.data.object.customer_email
        }
    } catch (error) {

    }
}
