import jwt from 'jsonwebtoken';
import { RolesEnum } from "../enums/user.enum";

interface JwtI{
    uid: string,
    username: string,
    roles: RolesEnum[]
}

export const generateJWT = ({uid, username, roles}:JwtI) => {
    return new Promise((resolve, reject) => {

        const payload = {uid, username, roles}; // Contenido del token

        jwt.sign(payload, process.env.SECRET_JWT_SEED || "", {
            expiresIn: '4h',
        }, (err, token) => { // callback
            // Si hay error
            if(err){
                console.log(err)
                reject("No se pudo generar el token")
            }

            //Envio el token generado
            resolve(token);

        });
    })
}