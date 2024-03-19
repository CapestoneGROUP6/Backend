import express from "express";
import { userProfile } from "../controllers/userController";
import { AuthMiddlewares } from "../middleware/authMiddlewares";
import { addCategory, deleteCategory, editCategory, getCategories } from "../controllers/CategoriesController";
const router = express.Router();

router.get("/", getCategories);
router.post("/", AuthMiddlewares.authenticate, AuthMiddlewares.isUserAdmin, addCategory)
router.put("/", AuthMiddlewares.authenticate, AuthMiddlewares.isUserAdmin, editCategory)
router.delete("/:id", AuthMiddlewares.authenticate, AuthMiddlewares.isUserAdmin, deleteCategory)


export const categoriesRouter = router;
