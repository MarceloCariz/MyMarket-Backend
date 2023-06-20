import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { HTTP_RESPONSE } from "../enums/httpErrors.enum";


const findUser = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const isUser = await User.findOne({ email: req.body.email });
        if (isUser) {
            return res.status(HTTP_RESPONSE.BadRequest).json({ message: "El usuario ya existe" });
        }
    next();
    } catch (error) {
        console.error(error);
        res.status(HTTP_RESPONSE.InternalServerError).json({ message: "Error del servidor" , error});
    }
};

export default findUser;