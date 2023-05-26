import {Router} from 'express'
import { createCategory, getAllCategories } from '../controllers/category.controller';
import authenticateJWT from '../middlewares/checkJWT.middleware';
import authorizeRole from '../middlewares/authorizeByRole.middleware';
import { RolesEnum } from '../enums/user.enum';



const router = Router();

router.post('/create',[authenticateJWT, authorizeRole(RolesEnum.ADMIN)]  ,createCategory);
router.get('/',getAllCategories);


export default router;