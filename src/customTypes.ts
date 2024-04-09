import { user } from "@prisma/client";
import { Request } from "express";

export interface CustomRequest extends Request {
  user?: user;
  checkAdmin?: boolean
}

export interface PlaceOrder {
  address: string
  zipcode: string
  mobile: string
  email: string
}

export interface GoogleLinkRequest {
  uid: string,
  email: string,
  displayName: string
  phoneNumber: string
}