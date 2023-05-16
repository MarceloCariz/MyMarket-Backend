import { Schema, SchemaDefinitionProperty, model } from "mongoose";

export interface ProductI{
    title:string,
    description: string,
    price: Number,
    stock: Number,
    shop: SchemaDefinitionProperty<string>,
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
    shop:{
        type: Schema.Types.ObjectId,
        ref: "shops",
        required: true,
    }
});

export default model('Product', ProductSchema);