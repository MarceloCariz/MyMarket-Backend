import express from 'express';
import { createUser, updateUser } from '../controllers/user.controller';
import { schemaValidation } from '../middlewares/schemaValidator.middleware';
import { createUserSchema, updateUserSchema } from '../schemas/user.schema';


const router = express.Router();

router.post('/create', schemaValidation(createUserSchema) , createUser);

router.put('/update/:id', schemaValidation(updateUserSchema), updateUser );

router.get('/', (req, res) => {

});


export default router;