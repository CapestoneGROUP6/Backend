import express from 'express'
import { adminLOgin, adminsignup, forgotPassword, login, resetPassword, signup } from '../controllers/authControlle'
import { AuthMiddlewares } from '../middleware/authMiddlewares'
import { disableUser, enableUser, getAllUsers } from '../controllers/adminController'
const router = express.Router()

router.get("/allusers", AuthMiddlewares.authenticate, AuthMiddlewares.isUserAdmin, getAllUsers)
router.get("/user/disable/:id", AuthMiddlewares.authenticate, AuthMiddlewares.isUserAdmin, disableUser)
router.get("/user/enable/:id", AuthMiddlewares.authenticate, AuthMiddlewares.isUserAdmin, enableUser)


export const adminRoutes = router;