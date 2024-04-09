import express from 'express'
import { createStripeSession } from '../controllers/stripeController';
import { AuthMiddlewares } from '../middleware/authMiddlewares';
const router = express.Router()

router.post("/checkoutsession", AuthMiddlewares.authenticate, createStripeSession)
router.post("/webhook", createStripeSession)


export const stripeRouter = router;