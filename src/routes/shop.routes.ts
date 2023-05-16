import {Router} from 'express';
import { createShopSchema } from '../schemas/shop.schema';
import { schemaValidation } from '../middlewares/schemaValidator.middleware';
import { createShop, getShops } from '../controllers/shop.controller';



const router = Router();


router.post('/create', schemaValidation(createShopSchema), createShop);

router.get('/', getShops);

export default router;