import {Router} from 'express';
import { schemaValidation } from '../middlewares/schemaValidator.middleware';
import { createProduct, getAllProductsByShop, getProductByShop } from '../controllers/product.controller';
import { createProductSchema } from '../schemas/product.schema';


const router =  Router();

router.post('/create',schemaValidation(createProductSchema), createProduct);

router.get('/all', getAllProductsByShop);


router.get('/shop/:shopId', getProductByShop);



export default router;