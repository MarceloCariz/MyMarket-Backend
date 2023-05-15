import { Request, Response, NextFunction } from "express";
import { RolesEnum } from "../enums/user.enum";
import { UserI } from "../models/User";

interface AuthenticatedRequest extends Request {
    user: UserI;
}

export const authorizeRole = (requiredRole: RolesEnum) => {

    return (req:AuthenticatedRequest, res: Response, next: NextFunction) => {

        const userRole = req.user.roles; 

        if (userRole.includes(requiredRole)) {
            next(); // El usuario tiene el rol adecuado, continúa con la siguiente función de middleware o controlador
        } else {
        res.status(403).json({ message: "Acceso denegado" }); // El usuario no tiene el rol adecuado, devuelve un error de acceso denegado
        }
    };
};
