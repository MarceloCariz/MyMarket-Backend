import { z } from "zod";


export const categorySchema = z.object({
    body: z.object({
        categoryName: z.string().min(3, "La categoría debe tener un mínimo de 3 caracteres").nonempty("La categoría es requerida"),
    })
})

