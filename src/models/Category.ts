import { Schema, model } from "mongoose";



export interface CategoryI{
    _id?: string;
    categoryName: string;
}



const CategorySchema = new Schema<CategoryI>({
    categoryName:{
        type: String,
        required: true
    }
})


export default model('Category', CategorySchema);
