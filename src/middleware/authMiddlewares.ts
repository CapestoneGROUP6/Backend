import { NextFunction, Request, Response } from "express";
import { JwtUtil } from "../utils/JwtUtil";
import { PrismaClient } from "@prisma/client";
import { CustomRequest } from "../customTypes";

const prisma = new PrismaClient();

export class AuthMiddlewares {
  static async authenticate(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decoded = JwtUtil.verifyToken(token);
      if (!decoded || !decoded.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await prisma.user.findFirst({
        where: {
          ID: decoded.id,
        },
      });

      if (!user || !user.ID) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.user = user;

      next();
    } catch (error) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }
  }

  static async isUserAdmin(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    console.log("sdfsdfdsf");
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decoded = JwtUtil.verifyToken(token);
      if (!decoded || !decoded.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await prisma.user.findFirst({
        where: {
          ID: decoded.id,
        },
      });

      if (!user || !user.ID || user.ROLE?.toLocaleLowerCase() !== 'admin') {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.user = user;

      next();
    } catch (error) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }
  }

  static addAdminFlag(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      req.checkAdmin = true;
      next();
    } catch (error) {
      return res.status(500).json({ error: "Erro" });
    }
  }
}
