import {Request, Response} from 'express'
import Category, { CategoryI } from "../models/Category";




export const createCategory = async(req: Request, res: Response) => {
    try {
        const {categoryName}:CategoryI = req.body;

        if(!categoryName) return res.status(404).json({message:"No se proporciono un nombre de categoría"});

        const lowerCategoryName = categoryName.toLowerCase().trim();



        const isCategory = await Category.findOne({'categoryName': lowerCategoryName});
        if(isCategory) return res.status(400).json({message:"La categoría ya existe"});

        const category = await Category.create({categoryName: lowerCategoryName});
        await category.save();

        res.status(201).json(category);

    } catch (error) {
        console.log(error)
    }
}