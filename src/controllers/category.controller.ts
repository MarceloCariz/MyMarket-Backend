import {Request, Response} from 'express'
import Category, { CategoryI } from "../models/Category";
import { HTTP_RESPONSE } from '../enums/httpErrors.enum';
import { isObjectIdOrHexString } from 'mongoose';


export const createCategory = async(req: Request, res: Response) => {
    try {
        const {categoryName}:CategoryI = req.body;

        if(!categoryName) return res.status(404).json({message:"No se proporciono un nombre de categoría"});

        const lowerCategoryName = categoryName.toLowerCase().trim();



        const isCategory = await Category.findOne({'categoryName': lowerCategoryName});
        if(isCategory) return res.status(400).json({message:"La categoría ya existe"});

        const category = await Category.create({categoryName: lowerCategoryName});
        await category.save();

        res.status(HTTP_RESPONSE.Created).json(category);

    } catch (error) {
        console.log(error)
        res.status(HTTP_RESPONSE.InternalServerError).json({message:"Internal server error"})
    }
}

export const getAllCategories = async( req:Request, res:Response) => {
    try {
        const categories = await Category.find({});

        res.json(categories);
    } catch (error) {
        console.log(error)
        res.status(HTTP_RESPONSE.InternalServerError).json({message:"Internal server error"})
    }
}


export const deleteCategory = async(req:Request, res: Response) => {
    try {
        const _id = req.params.id;
        const isCategory = await Category.findById(_id);
        if(!isCategory) return res.status(HTTP_RESPONSE.NotFound).json({message:"La categoría no existe"}); 

        await isCategory.deleteOne();
        res.status(HTTP_RESPONSE.Created).json({message: 'Eliminada correctamente'})

    } catch (error) {
        console.log(error)
        res.status(HTTP_RESPONSE.InternalServerError).json({message:"Internal server error"})
    }
}

export const updateCategory = async(req: Request, res:Response) => {
    try {
        const _id = req.params.id;

        if(!isObjectIdOrHexString(_id)) return res.status(400).json({message:`id: ${_id} formato incorrecto`});
        const isCategory = await Category.findById(_id);

        if(!isCategory) return res.status(HTTP_RESPONSE.NotFound).json({message:"La categoría no existe"});
        
        const newCategory = await Category.findByIdAndUpdate(_id,{...req.body}, {new: true});
        res.status(HTTP_RESPONSE.OK).json(newCategory)
    } catch (error) {
        console.log(error)
        res.status(HTTP_RESPONSE.InternalServerError).json({message:"Internal server error"})
    }
}
