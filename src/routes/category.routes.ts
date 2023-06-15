import {Router} from 'express'
import { createCategory, deleteCategory, getAllCategories, updateCategory } from '../controllers/category.controller';
import authenticateJWT from '../middlewares/checkJWT.middleware';
import authorizeRole from '../middlewares/authorizeByRole.middleware';
import { RolesEnum } from '../enums/user.enum';
import { schemaValidation } from '../middlewares/schemaValidator.middleware';
import { categorySchema } from '../schemas/category.schema';



const router = Router();

router.post('/create',[authenticateJWT, authorizeRole(RolesEnum.ADMIN), schemaValidation(categorySchema)]  ,createCategory);
router.delete('/delete/:id',[authenticateJWT, authorizeRole(RolesEnum.ADMIN)], deleteCategory);
router.put('/update/:id',[authenticateJWT, authorizeRole(RolesEnum.ADMIN), schemaValidation(categorySchema)], updateCategory);
router.get('/',getAllCategories);

export default router;


/**
 * @swagger
 * components:
 *  schemas:
 *    Category:
 *      type: object
 *      properties:
 *          _id:
 *            type: string
 *            description: Id category
 *          categoryName:
 *            type: string
 *            description: Category name
 *      required:
 *        - categoryName
 *      example:
 *        categoryName: "testCategory"
 *             
 */


/**
 * @swagger
 *   /category/create:
 *   post:
 *     tags: [Category]
 *     summary: Create a category
 *     description: Create a category
 *     requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *               type: object
 *               $ref: '#components/schemas/Category'
 *     responses:
 *       201:
 *         description: return the new category.
 */

/**
 * @swagger
 *   /category/:
 *   get:
 *     tags: [Category]
 *     summary: Get all categories
 *     description: Get all categories
 *     responses:
 *       200:
 *         description: return the all categories.
 */


/**
 * @swagger
 *   /category/update/{id}:
 *   put:
 *     tags: [Category]
 *     summary: update a category by id
 *     description: update a category by id
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Category ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *               type: object
 *               $ref: '#components/schemas/Category'
 *     responses:
 *       200:
 *         description: return the all categories.
 */


/**
 * @swagger
 *   /category/delete{id}:
 *   delete:
 *     tags: [Category]
 *     summary: Delete a category by id
 *     description: Delete a category by id
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Category ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: return the all categories.
 */