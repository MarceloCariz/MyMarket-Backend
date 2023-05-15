import { Request, Response } from "express";
import Product from "../models/Product";



export const createProduct = async (req: Request,res: Response) => {
    try {
        const product =  await Product.create(req.body);
        await product.save();
        res.status(201).json(product)
    } catch (error) {
        res.status(500).json({message:"Interal server error"})
    }
}