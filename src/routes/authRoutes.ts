import express from 'express'
import { adminLOgin, adminsignup, forgotPassword, login, resetPassword, signup } from '../controllers/authControlle'
import { AuthMiddlewares } from '../middleware/authMiddlewares'
const router = express.Router()

router.post("/login", login)
router.post("/signup", signup)
router.post("/admin/signup" ,adminsignup), 
router.post("/admin/login", adminLOgin)


router.post("/forgotpassword", forgotPassword)
router.post("/resetpassword", resetPassword)

export const authRouter = router;