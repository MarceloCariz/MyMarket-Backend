import { NextFunction, Request, Response } from "express";
import Shop from "../models/Shop";
import { HTTP_RESPONSE } from "../enums/httpErrors.enum";



const findShop = async (req:Request, res:Response, next:NextFunction) => {
        try {
        const isShop = await Shop.findOne({ email: req.body.email });
        if (isShop) {
            return res.status(HTTP_RESPONSE.BadRequest).json({ message: "El comercio ya existe" });
        }
        next();
        } catch (error) {
        // Manejo del error
        console.error(error);
        res.status(HTTP_RESPONSE.InternalServerError).json({ message: "Error del servidor", error });
        }
};


export default findShop;