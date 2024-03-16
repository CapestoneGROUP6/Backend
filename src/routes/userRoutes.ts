import express from "express";
import { modifyProfile, userProfile } from "../controllers/userController";
import { AuthMiddlewares } from "../middleware/authMiddlewares";
const router = express.Router();

router.get("/profile", AuthMiddlewares.authenticate, userProfile);
router.post("/profile", AuthMiddlewares.authenticate, modifyProfile);

export const userRouter = router;
