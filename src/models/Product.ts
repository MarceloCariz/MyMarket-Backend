import { Schema, SchemaDefinitionProperty, model } from "mongoose";

export interface ProductI{
    title:string,
    description: string,
    imgUrl: string,
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
    imgUrl: {
        type: String,
        required: true
    },
    stock:{
        type: Number,
        require: true
    },
    shop:{
        type: Schema.Types.ObjectId,
        ref: "Shop",
        required: true,
    }
});

export default model('Product', ProductSchema);