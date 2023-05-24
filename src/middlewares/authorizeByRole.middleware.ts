import { Request, Response, NextFunction } from "express";
import { RolesEnum } from "../enums/user.enum";

export interface AuthenticatedRequest extends Request {
    uid?: string;
    username?: string;
    roles?: RolesEnum[];
}

const authorizeRole = (requiredRole: RolesEnum) => {
    return (req:AuthenticatedRequest, res: Response, next: NextFunction) => {

        const userRole = req.roles; 

        if(userRole?.length === 0 || userRole === undefined) return res.status(400).json({message: "No hay roles"})

        if (userRole.includes(requiredRole)) {
            next(); // El usuario tiene el rol adecuado, continúa con la siguiente función de middleware o controlador
        } else {
            res.status(403).json({ message: "Acceso denegado" }); 
           // El usuario no tiene el rol adecuado, devuelve un error de acceso denegado
        }
    };
};

export default authorizeRole;