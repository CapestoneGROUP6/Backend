import express from "express";
import { modifyProfile, userProfile } from "../controllers/userController";
import { AuthMiddlewares } from "../middleware/authMiddlewares";
import { clearCart, getProductInfoFromCart, getUserCart, updateCartDetails } from "../controllers/cartController";
const router = express.Router();

router.get("/", AuthMiddlewares.authenticate, getUserCart);
router.delete("/", AuthMiddlewares.authenticate, clearCart);
router.put("/", AuthMiddlewares.authenticate, updateCartDetails);
router.get("/product/:id", AuthMiddlewares.authenticate, getProductInfoFromCart);

export const cartRouter = router;
