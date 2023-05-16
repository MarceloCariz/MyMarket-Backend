import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import User from "../models/User";
import Shop from "../models/Shop";


export const createUser = async (req:Request, res:Response) => {
    try {
        // Buscar usuario
        const isUser = await User.findOne({email: req.body.email});
        const isShop = await Shop.findOne({email: req.body.email});

        //mandar mensaje si se encuentra
        if(isUser) return res.status(400).json({message:"El usuario ya existe"});
        if(isShop) return res.status(400).json({message:"El usuario ya existe"});

        //Crear el usuario
        const user = await User.create(req.body);

        
        //Encriptar contrasena
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);


        //Guardar el usuario creado
        await user.save();

        //Enviar el usuario guardado desde la db
        res.status(201).json(user);

    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal server Error"});
    }
}

export const updateUser = (req:Request, res:Response) => {
    try {
        res.send("correcto")
    } catch (error) {
        res.status(500).json({message: "Internal server Error"});
    }
}




