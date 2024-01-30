import express from 'express'
import { login, signup } from '../controllers/authControlle'
const router = express.Router()

router.post("/login", login)
router.post("/signup", signup)

export const authRouter = router;