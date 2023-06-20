import { z } from "zod";


export const createProductSchema = z.object({
    body: z.object({
        title: z.string().nonempty("El nombre del producto es requerido"),
    
        price: z.string().refine((value) => {
            const numberValue = parseFloat(value);
            return !isNaN(numberValue) && numberValue > 0;
        }, {message: "El precio debe ser un número positivo válido",}),

        stock: z.string().refine((value) => {
            const numberValue = parseFloat(value);
            return !isNaN(numberValue) && numberValue >= 0;
        }, {message: "El stock debe ser un número positivo válido",}),

        shop: z.string({required_error:"EL id de la tienda es obligatorio", invalid_type_error:"El id debe ser un string"}).nonempty("EL id de la tienda es obligatorio"),
        
        category: z.string({required_error:"EL id de la categoría es obligatorio", invalid_type_error:"El id debe ser un string"}).nonempty("EL id de la categoría es obligatorio")
    })
});




