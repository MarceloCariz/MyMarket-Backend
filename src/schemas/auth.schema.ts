import { z } from "zod";


export const loginUserSchema = z.object({
    body: z.object({
        email: z.string().email().nonempty("El email es requerido"),
        password: z.string().min(8,"La contraseña debe tener un minimo de 8 caracteres").max(20, "La contraseña es demasiado larga")
    })
})