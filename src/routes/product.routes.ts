import {Router} from 'express';
import { schemaValidation } from '../middlewares/schemaValidator.middleware';
import { createProduct, getAllProductsByShop, getProductByShop } from '../controllers/product.controller';
import { createProductSchema } from '../schemas/product.schema';
import authenticateJWT from '../middlewares/checkJWT.middleware';
import authorizeRole  from '../middlewares/authorizeByRole.middleware';
import { RolesEnum } from '../enums/user.enum';


const router =  Router();

router.post('/create', [authenticateJWT, authorizeRole(RolesEnum.SHOP)] , schemaValidation(createProductSchema), createProduct);

router.get('/all', getAllProductsByShop);


router.get('/shop/:shopId', getProductByShop);



export default router;