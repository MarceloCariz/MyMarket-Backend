import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import { RolesEnum } from '../enums/user.enum';
import { HTTP_RESPONSE } from '../enums/httpErrors.enum';


export interface JWTRequestI extends Request{
    uid?: string,
    username?: string,
    roles?: RolesEnum[]
}




// Autenticacion con jwt
const authenticateJWT = (req:JWTRequestI, res:Response, next: NextFunction) => {

    const token = req.header('Authorization')?.split(' ')[1]; // ['Bearer', 'token']  [1] = token

    if(!token){
        return res.status(HTTP_RESPONSE.Unauthorized).json({message: 'No se proporciono un token de autorizacion'})
    }

    try {
        const {uid, username, roles}:any = jwt.verify(token, process.env.SECRET_JWT_SEED!);


        // Guardar la info del usuario 
        req.uid = uid;
        req.username = username;
        req.roles = roles;

        next(); // pasa al siguiente, controlador

    } catch (error) {
        return res.status(HTTP_RESPONSE.Forbidden).json({message: 'Token de autenticacion no valido'});
    }
}

export default authenticateJWT;