import {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import Shop from "../models/Shop";
import User from '../models/User';




export const createShop = async (req: Request, res: Response) => {
    try {
        // Buscar comercio
        const isShop = await Shop.findOne({email: req.body.email});
        const isUser = await User.findOne({email: req.body.email});

        //mandar mensaje si se encuentra
        if(isShop) return res.status(400).json({message:"El comercio ya existe"});
        if(isUser) return res.status(400).json({message:"El comercio ya existe"})


        //Crear el comercio
        const shop = await Shop.create(req.body);

        
        //Encriptar contrasena
        const salt = bcrypt.genSaltSync();
        shop.password = bcrypt.hashSync(shop.password, salt);


        //Guardar el comercio creado
        await shop.save();

        //Enviar el comercio guardado desde la db
        res.status(201).json(shop);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server Error"});
    }
}


export const getShops = async(req : Request, res: Response) => {
    try {
        const shops = await Shop.find({}).select("id").select("username");

        res.status(200).json(shops);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server Error"});
    }
}