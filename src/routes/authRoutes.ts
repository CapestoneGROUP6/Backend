import express from 'express'
import { adminsignup, forgotPassword, login, resetPassword, signup } from '../controllers/authControlle'
import { AuthMiddlewares } from '../middleware/authMiddlewares'
const router = express.Router()

router.post("/login", login)
router.post("/signup", signup)
router.post("/admin/signup" ,adminsignup), 

router.post("/forgotpassword", forgotPassword)
router.post("/resetpassword", resetPassword)

export const authRouter = router;