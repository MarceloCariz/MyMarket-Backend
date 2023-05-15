import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import User from "../models/User";
import { generateJWT } from "../helpers/jwt";
import { JWTRequestI } from "../middlewares/checkJWT.middleware";


export const login = async(req: Request, res: Response) => {
    const {email, password} = req.body;
    try {

        const user = await User.findOne({email}); // Busca al usuario por email

        if(!user) return res.status(400).json({message:"Email o contraseña incorrecto"});

        //Validar passoword
        const validPassword = bcrypt.compareSync(password, user.password);

        if(!validPassword) return res.status(400).json({message:"Email o contraseña incorrecto"});

        //Generar jwt
        const token = await generateJWT({uid: user.id, username: user.username, roles: user.roles});

        res.json({
            uid: user.id,
            username: user.username,
            roles: user.roles,
            token
        })

        
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}


export const revalidateToken = async(req: JWTRequestI, res: Response) => {

    const uid = req.uid!;
    const username = req.username!;
    const roles = req.roles!;

    const token = await generateJWT({uid, username, roles});

    res.json({
        token
    })

}