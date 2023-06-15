import express from 'express';
import { schemaValidation } from '../middlewares/schemaValidator.middleware';
import { loginUserSchema } from '../schemas/auth.schema';
import { login, revalidateToken } from '../controllers/auth.controller';
import authenticateJWT from '../middlewares/checkJWT.middleware';


const router = express.Router();


router.post('/login', schemaValidation(loginUserSchema), login);


router.get('/revalidate', authenticateJWT , revalidateToken);


export default router;


/**
 * @swagger
 *   /auth/login/:
 *   post:
 *     tags: [Auth]
 *     summary: Login for users, admin, shops
 *     description: Login for users, admin, shops
 *     requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *               type: object
 *               $ref: '#components/schemas/Auth'
 *     responses:
 *       200:
 *         description: return token.
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    Auth:
 *      type: object
 *      properties:
 *          email:
 *            type: string
 *            description: email user
 *          password:
 *            type: string
 *            description: password user
 *      required:
 *        - email
 *        - password
 *      example:
 *        email: test@correo.com
 *        password: "12345678"
 *             
 */