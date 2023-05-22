import express from 'express';
import { createUser, getProfile, updateProfile, updateUser } from '../controllers/user.controller';
import { schemaValidation } from '../middlewares/schemaValidator.middleware';
import { createUserSchema, updateProfileUserSchema, updateUserSchema } from '../schemas/user.schema';
import authenticateJWT from '../middlewares/checkJWT.middleware';
import authorizeRole from '../middlewares/authorizeByRole.middleware';
import { RolesEnum } from '../enums/user.enum';
import multer from 'multer';


const storage = multer.diskStorage({});
const upload = multer({storage})


const router = express.Router();

router.post('/create', schemaValidation(createUserSchema) , createUser);

router.put('/update/profile/', 
    [authenticateJWT, authorizeRole(RolesEnum.USER), schemaValidation(updateProfileUserSchema), upload.single("imgProfile")], 
        updateProfile);

router.get('/profile/', [authenticateJWT, authorizeRole(RolesEnum.USER)], getProfile);

router.put('/update/:id', schemaValidation(updateUserSchema), updateUser );

router.get('/', (req, res) => {

});


export default router;