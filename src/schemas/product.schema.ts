import { z } from "zod";


export const createProductSchema = z.object({
    body: z.object({
        title: z.string().nonempty("El nombre del producto es requerido"),
    
        description: z.string().nonempty("La descripcion es requerida")
            .min(6, "La descripcion es demasiado corta")
            .max(50, "La descripcion es demasiado larga"),
    
        price: z.number({required_error: "EL precio requerido", invalid_type_error: "EL precio debe ser un numero"})
            .positive("El precio debe ser positivo"),

        stock: z.number({required_error: "EL stock requerido", invalid_type_error: "EL stock debe ser un numero"})
        .positive("El stock debe ser positivo"),

        shop: z.string({required_error:"EL id de la tienda es obligatorio", invalid_type_error:"El id debe ser un string"}).nonempty("EL id de la tienda es obligatorio")
    
    })
})