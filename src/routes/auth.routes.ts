import express from 'express';
import { schemaValidation } from '../middlewares/schemaValidator.middleware';
import { loginUserSchema } from '../schemas/auth.schema';
import { login, revalidateToken } from '../controllers/auth.controller';
import authenticateJWT from '../middlewares/checkJWT.middleware';


const router = express.Router();

router.post('/login', schemaValidation(loginUserSchema), login);


router.get('/revalidate', authenticateJWT , revalidateToken);


export default router;