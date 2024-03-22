import express from "express";
import { modifyProfile, userProfile } from "../controllers/userController";
import { AuthMiddlewares } from "../middleware/authMiddlewares";
import { getUserCart, updateCartDetails } from "../controllers/cartController";
const router = express.Router();

router.get("/", AuthMiddlewares.authenticate, getUserCart);
router.put("/", AuthMiddlewares.authenticate, updateCartDetails);

export const cartRouter = router;
