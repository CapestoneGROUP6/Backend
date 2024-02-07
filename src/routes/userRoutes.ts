import express from "express";
import { userProfile } from "../controllers/userController";
import { AuthMiddlewares } from "../middleware/authMiddlewares";
const router = express.Router();

router.get("/profile", AuthMiddlewares.authenticate, userProfile);

export const userRouter = router;
