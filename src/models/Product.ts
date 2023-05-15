import { Schema, model } from "mongoose";

export interface ProductI {
    title:string,
    description: string,
    price: Number,
    stock: Number,
    category?: string[],
}


const ProductSchema = new  Schema<ProductI>({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        require: true
    },
    description:{
        type: String,
        required: false
    },
    stock:{
        type: Number,
        require: true
    },
});

export default model('product', ProductSchema);