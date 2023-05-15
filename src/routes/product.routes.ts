import {Router} from 'express';
import { schemaValidation } from '../middlewares/schemaValidator.middleware';
import { createProduct } from '../controllers/product.controller';
import { createProductSchema } from '../schemas/product.schema';


const router =  Router();

router.post('/create',schemaValidation(createProductSchema), createProduct);



export default router;