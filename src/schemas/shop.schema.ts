import { z } from "zod";
import { RolesEnum } from "../enums/user.enum";



export const createShopSchema =z.object({
    body: z.object({
        email: z.string().nonempty("El email es requerido").email({
            message: "El email no es valido, por favor intente nuevamente",
        }),
    
        password: z.string().nonempty("La contraseña es requerida")
            .min(8, "La contraseña es demasiado corta")
            .max(20, "La contraseña es demasiado larga"),
    
        username: z.string().nonempty("El nombre de usuario es requerido")
            .min(3, "Debe tener un minimo de 3 caracteres")
            .max(20,"No debe superar los 20 caracteres"),
        
        shopName: z.string().nonempty("El nombre de la tienda es requerido")
        .min(3, "Debe tener un minimo de 3 caracteres")
        .max(20,"No debe superar los 20 caracteres"),
    
        roles: z.nativeEnum(RolesEnum).array().nonempty("Se debe proporcionar un rol")
    })
});


