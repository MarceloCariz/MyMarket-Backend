import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import User from "../models/User";
import { generateJWT } from "../helpers/jwt";
import { JWTRequestI } from "../middlewares/checkJWT.middleware";
import Shop from "../models/Shop";
import { HTTP_RESPONSE } from "../enums/httpErrors.enum";


export const login = async(req: Request, res: Response) => {
    const {email, password} = req.body;
    try {
        let user = null;
        let isUser = await User.findOne({email}); // Busca al usuario por email
        let isShop = await Shop.findOne({email});

        
        if(isShop){
            user = isShop;
        }
        if(isUser){
            user = isUser;
        }

        if(!user){ 
            return res.status(HTTP_RESPONSE.Unauthorized).json({message:"Email o contraseña incorrecto"})
        };



        //Validar passoword
        const validPassword = bcrypt.compareSync(password, user.password);

        if(!validPassword) return res.status(HTTP_RESPONSE.Unauthorized).json({message:"Email o contraseña incorrecto"});

        //Generar jwt
        const token = await generateJWT({uid: user.id, username: user.username, roles: user.roles});

        res.json({
            token
        })

        
    } catch (error) {
        res.status(HTTP_RESPONSE.InternalServerError).json({message:"Internal server error"})
    }
}


export const revalidateToken = async(req: JWTRequestI, res: Response) => {

    const uid = req.uid!;
    const username = req.username!;
    const roles = req.roles!;

    try {

        const isUser = await User.findById(uid);
        const isShop = await Shop.findById(uid);
    
        let user;
    
        if(isUser){
            user = isUser;
        }
    
        if(isShop){
            user = isShop;
        }

        if(!user) return res.status(HTTP_RESPONSE.BadRequest).json({message: "Usuario no encontrado, no se puede revalidar el token"})

        const token = await generateJWT({uid, username, roles});

        res.json({
            uid,
            username,
            roles,
            token
        })
    } catch (error) {
        res.status(HTTP_RESPONSE.BadRequest).json({message: "Usuario no encontrado, no se puede revalidar el token"})
    }

}