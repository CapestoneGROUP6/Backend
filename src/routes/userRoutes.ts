import express from "express";
import { deleteAccount, downloadInvoice, modifyProfile, placeNewOrder, userOrders, userProfile } from "../controllers/userController";
import { AuthMiddlewares } from "../middleware/authMiddlewares";
const router = express.Router();

router.get("/profile", AuthMiddlewares.authenticate, userProfile);
router.post("/profile", AuthMiddlewares.authenticate, modifyProfile);
router.post("/placeorder", AuthMiddlewares.authenticate, placeNewOrder);
router.get("/orders", AuthMiddlewares.authenticate, userOrders);
router.delete("/deleteaccount", AuthMiddlewares.authenticate, deleteAccount);
router.get("/invoice/:id", AuthMiddlewares.authenticate, downloadInvoice);

export const userRouter = router;
