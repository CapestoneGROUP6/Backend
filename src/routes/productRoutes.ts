import express from "express";
import { userProfile } from "../controllers/userController";
import { AuthMiddlewares } from "../middleware/authMiddlewares";
import multer from 'multer';
import path from 'path';
import { addProduct, approveProduct, deleteProduct, editProduct, getAllProducts, getPendingApprovalProducts, getProductDetails, getProductDetailsBYCategory, rejectProduct } from "../controllers/productsController";
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


router.get("/", getAllProducts);
router.get("/category/:id?", getProductDetailsBYCategory);
router.get("/:id", getProductDetails);
router.get("/admin/pendingapproval", AuthMiddlewares.isUserAdmin, getPendingApprovalProducts);
router.post("/", AuthMiddlewares.authenticate, upload.fields([{ name: 'file', maxCount: 1 }, { name: 'bookFile', maxCount: 1 }]), addProduct);
router.put("/", AuthMiddlewares.authenticate, upload.single('file'), editProduct);
router.get("/admin/approval/:id", AuthMiddlewares.isUserAdmin, approveProduct);
router.get("/admin/reject/:id", AuthMiddlewares.isUserAdmin, rejectProduct);
router.delete("/:id", AuthMiddlewares.isUserAdmin, deleteProduct);


export const productRouter = router;
