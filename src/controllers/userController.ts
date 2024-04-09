import { NextFunction, Request, Response } from "express";
import { CustomRequest, PlaceOrder } from "../customTypes";
import { PrismaClient, user } from "@prisma/client";
import easyinvoice from "easyinvoice";

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


export const deleteAccount = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    await prisma.user.delete({
      where: {
        ID: user?.ID
      }
    })
    res.json({ status: true });
  } catch (error) {
    res.json({
      status: false,
    });
  }
};


export const downloadInvoice = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const fullOrderDEtails = await getUserOrders(user!.ID);
    const orderDetails = fullOrderDEtails?.find(obj => obj.orderid === +id)
    if (!orderDetails) {
      return res.status(400).json({ status: false });
    }
    let products = []
    for (let i = 0; i < orderDetails?.orderItems?.length; i++) {
      const { itemDetails, quantity } = orderDetails.orderItems[i];
      products.push({
        quantity: `${quantity}`,
        "tax-rate": 18,
        price: Number(itemDetails!.PRICE),
        description: itemDetails!.NAME || ''
      });
    }

    const orderINf0 = await prisma.orders.findFirst({
      where: {
        orderid: orderDetails.orderid
      }
    })

    var data = {
      sender: {
        company: "BookBazar",
        address: "Kitchener Downtown",
        zip: "N2B 2R2",
        city: "Kitchener",
        country: "Canada",
      },
      client: {
        address: orderINf0?.address,
        country: "Canada",
      },
      information: {
        number: `${orderINf0?.orderid}`,
        date: orderINf0?.date || '',
      },
      products,
      settings: {
        currency: "CAD",
      },
    };
    const response = await easyinvoice.createInvoice(data);
    const pdfBuffer = Buffer.from(response.pdf, "base64");
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({
      status: false,
    });
  }
};

export const getUserOrders = async (ID: number) => {
  const orders = await prisma.orders.findMany({
    where: {
      userid: ID
    }
  })

  const fullOrderDEtails = [];

  for (let i = 0; i < orders.length; i++) {
    const { orderid, total } = orders[i];
    const Orderitems = await prisma.order_item.findMany({
      where: {
        orderid
      }
    })

    let orderItems = []
    for (let i = 0; i < Orderitems.length; i++) {
      const { itemid, quantity } = Orderitems[i];
      const itemDetails = await prisma.items.findFirst({
        where: {
          ID: itemid
        }
      })
      orderItems.push({
        itemDetails,
        quantity,
      })
    }
    const obj = {
      orderid,
      orderItems,
      total
    }
    fullOrderDEtails.push(obj)
  }

  return fullOrderDEtails
}


export const userOrders = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const fullOrderDEtails = await getUserOrders(user!.ID);
    res.json(fullOrderDEtails);
  } catch (error) {
    res.json([]);
  }
};

export const placeNewOrder = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { body } = req;
    const { address, email, mobile, zipcode } = body as PlaceOrder
    if (!address || !mobile || !zipcode) {
      console.log("INvalid detials")
      res.json({
        status: false,
      });
    }
    const { ID } = req.user!;
    const details = await prisma.cart.findMany({
      where: {
        userid: +ID
      }
    })

    const paymentid = `${new Date().getTime()}`;
    let ordertotal = details.reduce((total, { count, unitprice }) => {
      const totalPrice = +unitprice * count;
      return total + totalPrice;
    }, 0);

    if(ordertotal === 0) {
      return res.status(404)
    }

    const taxAmount = ((18 * ordertotal) / 100)
    ordertotal += taxAmount;

    const orderDtails = await prisma.orders.create({
      data: {
        address,
        total: ordertotal,
        userid: +ID,
        email,
        mobile,
        paymentid,
        zipcode,
        date: new Date().toDateString()
      }
    })

    const orderItems = details.map(detail => ({
      itemid: detail.itemid,
      orderid: orderDtails.orderid,
      quantity: detail.count
    }));

    await prisma.order_item.createMany({
      data: orderItems
    });

    await prisma.cart.deleteMany({
      where: {
        userid: +ID
      }
    });

    res.json({ status: true, orderDtails });
  } catch (error) {
    console.log(error)
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
    const { PASSWORD, OTP, ROLE, GOOGLE_ID, ...rest } = newDetails
    res.json({ status: true, user: { ...rest } });
  } catch (error) {
    console.log(error)
    res.json({
      status: false,
    });
  }
};
