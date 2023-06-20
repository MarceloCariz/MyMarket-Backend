import {Router} from 'express';
import { createShopSchema } from '../schemas/shop.schema';
import { schemaValidation } from '../middlewares/schemaValidator.middleware';
import { createShop, getShops } from '../controllers/shop.controller';
import findShop from '../middlewares/findShop.middleware';
import findUser from '../middlewares/findUser.middleware';



const router = Router();


router.post('/create', [schemaValidation(createShopSchema),findShop, findUser], createShop);

router.get('/', getShops);

export default router;