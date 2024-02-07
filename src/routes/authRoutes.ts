import express from 'express'
import { forgotPassword, login, resetPassword, signup } from '../controllers/authControlle'
const router = express.Router()

router.post("/login", login)
router.post("/signup", signup)
router.post("/forgotpassword", forgotPassword)
router.post("/resetpassword", resetPassword)

export const authRouter = router;