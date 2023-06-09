import {Router} from 'express';
import { schemaValidation } from '../middlewares/schemaValidator.middleware';
import { createProduct, deleteProduct, getAllProductsByShop, getProductByShop, updateProduct } from '../controllers/product.controller';
import { createProductSchema } from '../schemas/product.schema';
import authenticateJWT from '../middlewares/checkJWT.middleware';
import authorizeRole  from '../middlewares/authorizeByRole.middleware';
import { RolesEnum } from '../enums/user.enum';
import multer from '../utils/multer.config';

const storage = multer.diskStorage({});
const upload = multer({storage})

const router =  Router();
// , schemaValidation(createProductSchema)
router.post('/create', [authenticateJWT, authorizeRole(RolesEnum.SHOP), upload.single("image")], schemaValidation(createProductSchema) , createProduct);
router.delete('/delete/:productId', [authenticateJWT, authorizeRole(RolesEnum.SHOP)] , deleteProduct);

router.put('/update/:productId', [authenticateJWT, authorizeRole(RolesEnum.SHOP), upload.single("image")], updateProduct);

router.get('/all', getAllProductsByShop);


router.get('/shop/:shopId',authenticateJWT, getProductByShop);



export default router;