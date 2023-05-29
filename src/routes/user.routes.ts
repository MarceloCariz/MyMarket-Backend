import express from 'express';
import { createUser, deleteUser, getProfile, getUsers, updateProfile, updateUser } from '../controllers/user.controller';
import { schemaValidation } from '../middlewares/schemaValidator.middleware';
import { createUserSchema, updateProfileUserSchema, updateUserSchema } from '../schemas/user.schema';
import authenticateJWT from '../middlewares/checkJWT.middleware';
import authorizeRole from '../middlewares/authorizeByRole.middleware';
import { RolesEnum } from '../enums/user.enum';
import {JWTRequestI} from '../middlewares/checkJWT.middleware'
import multer from 'multer';
import { getCart } from '../controllers/product.controller';


const storage = multer.diskStorage({});
const upload = multer({storage})


const router = express.Router();

router.post('/create', schemaValidation(createUserSchema) , createUser);


router.delete("/delete/:id", [authenticateJWT, authorizeRole(RolesEnum.ADMIN)], deleteUser);

router.put('/update/profile/', 
    [authenticateJWT, authorizeRole(RolesEnum.USER), schemaValidation(updateProfileUserSchema), upload.single("imgProfile")], 
        updateProfile);

router.put('/update/:id', schemaValidation(updateUserSchema), updateUser );

router.get('/profile/', [authenticateJWT, authorizeRole(RolesEnum.USER)], getProfile);

router.get('/', getUsers);


router.post('/setcart', (req, res) => {
    const cart = req.body.cart;
    const  uid = req.body.uid;
    res.cookie(`cart-${uid}`, cart,{
        // maxAge: 86400000, // 1 day
        // httpOnly: false,
        // path: '/',
        maxAge: 86400000, 
        sameSite: 'none',
        secure: true, 
        // domain: '.mymarketm.netlify.app', 
        // path: '/',
    })
    res.send("Cookie")
})


router.get('/getcart', authenticateJWT,getCart)


export default router;