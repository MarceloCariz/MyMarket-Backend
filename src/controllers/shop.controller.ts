import {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import Shop from "../models/Shop";
import { HTTP_RESPONSE } from '../enums/httpErrors.enum';




export const createShop = async (req: Request, res: Response) => {
    try {

        //Crear el comercio
        const shop = await Shop.create(req.body);

        
        //Encriptar contrasena
        const salt = bcrypt.genSaltSync();
        shop.password = bcrypt.hashSync(shop.password, salt);


        //Guardar el comercio creado
        await shop.save();

        //Enviar el comercio guardado desde la db
        res.status(HTTP_RESPONSE.Created).json(shop);

    } catch (error) {
        console.log(error);
        res.status(HTTP_RESPONSE.InternalServerError).json({message: "Internal server Error"});
    }
}


export const getShops = async(req : Request, res: Response) => {
    try {
        const shops = await Shop.find({}).select("id").select("username");

        res.status(HTTP_RESPONSE.OK).json(shops);
    } catch (error) {
        console.log(error);
        res.status(HTTP_RESPONSE.InternalServerError).json({message: "Internal server Error"});
    }
}