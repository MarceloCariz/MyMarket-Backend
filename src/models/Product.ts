import { Schema, SchemaDefinitionProperty, model } from "mongoose";

export interface ProductI{
    _id?: string,
    title:string,
    description: string,
    imgUrl: string,
    price: Number,
    stock: Number,
    shop: SchemaDefinitionProperty<string>,
    publicId: string,
    category: SchemaDefinitionProperty<string>,
    categoryName?: string,
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
    publicId: {
        type: String,
        required: true,
    },
    stock:{
        type: Number,
        require: true
    },
    shop:{
        type: Schema.Types.ObjectId,
        ref: "Shop",
        required: true,
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    }
});

export default model('Product', ProductSchema);