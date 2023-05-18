import { z } from "zod";


export const createProductSchema = z.object({
    body: z.object({
        title: z.string().nonempty("El nombre del producto es requerido"),
    
        // description: z.string().nonempty("La descripcion es requerida")
        //     .min(6, "La descripcion es demasiado corta")
        //     .max(70, "La descripcion es demasiado larga"),
    
        price: z.string().refine((value) => {
            const numberValue = parseFloat(value);
            return !isNaN(numberValue) && numberValue > 0;
        }, {message: "El precio debe ser un número positivo válido",}),


        stock: z.string().refine((value) => {
            const numberValue = parseFloat(value);
            return !isNaN(numberValue) && numberValue >= 0;
        }, {message: "El stock debe ser un número positivo válido",}),

        // image: z.string().refine((value:any) => !!value, {
        //     message: "Se debe proporcionar un archivo",}),

        shop: z.string({required_error:"EL id de la tienda es obligatorio", invalid_type_error:"El id debe ser un string"}).nonempty("EL id de la tienda es obligatorio")
        

    })
})


// "title": "Galletas",
// "description": "Galletas chips de chocolate",
// "price": 2300,
// "stock": 23,
// "shop": "6463960ba78ce7b20a91ae2a"

        // z.number({required_error: "EL precio requerido", invalid_type_error: "EL precio debe ser un numero"})
        //     .positive("El precio debe ser positivo"),
        // z.number({required_error: "EL stock requerido", invalid_type_error: "EL stock debe ser un numero"})
        // .positive("El stock debe ser positivo"),