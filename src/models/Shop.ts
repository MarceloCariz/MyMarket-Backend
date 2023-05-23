import { Schema, model } from "mongoose";
import { RolesEnum } from "../enums/user.enum";

export interface ShopI {
    _id?: string;
    username: string;
    shopName: string;
    email: string;
    password: string;
    products: string[]; // Referencia a los IDs de los productos
    roles: RolesEnum[];
}

const ShopSchema = new Schema<ShopI>({
    username: {
        type: String,
        required: true,
    },
    shopName:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product", // Referencia al modelo de Producto
        },
    ],
    roles: {
        type: [String],
        default: [RolesEnum.SHOP]
    }
});

export default model<ShopI>("Shop", ShopSchema);
