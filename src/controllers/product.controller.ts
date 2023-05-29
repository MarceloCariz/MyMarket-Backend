import {  Request, Response } from "express";
import Product, { ProductI } from "../models/Product";
import Shop, { ShopI } from "../models/Shop";
import { isObjectIdOrHexString } from "mongoose";
import cloudinary from "../utils/cloudinary.config";
import { AuthenticatedRequest } from "../middlewares/authorizeByRole.middleware";
import Category, { CategoryI } from "../models/Category";
import { HTTP_RESPONSE } from "../enums/httpErrors.enum";
import { JWTRequestI } from "../middlewares/checkJWT.middleware";



export const createProduct = async (req: Request,res: Response) => {
    try {

        
        const {shop, category} = req.body;

        const file = req.file;

        if(!file) return res.status(HTTP_RESPONSE.NotFound).json({message: "Imagen no encontrada"});

        //Verficar el id de la tienda --- pasar a middleware
        const isShop = await Shop.findById(shop);
        if(!isShop) return res.status(HTTP_RESPONSE.NotFound).json({message:`Comercio con el id: ${shop} no encontrado`});

        //Verificar el id de la categoria --- pasar a middleware
        if(!isObjectIdOrHexString(category)) return res.status(400).json({message:`id: ${category} formato incorrecto`});
        const isCategory = await Category.findById(category);
        if(!isCategory) return res.status(HTTP_RESPONSE.NotFound).json({message:`Categoria con el id: ${category} no encontrado`});


        if(!req.file?.path) return  res.status(HTTP_RESPONSE.NotFound).json({message: "Imagen no encontrada"});
        
        //Subir imagen cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(req.file?.path, {
            resource_type: "auto",
            transformation: [
                {height: 400, crop: "scale"},
                {fetch_format: "webp"}
            ]
        });

        // Rescatar url y id de la imagen
        const {secure_url, public_id} = cloudinaryResponse;

        ///Producto con todos sus atributos
        const newProduct:ProductI = {
            ...req.body,
            imgUrl: secure_url,
            publicId: public_id
        }

        //Crear producto
        const product =  await Product.create(newProduct);
        await product.save(); //Guardar producto

        //Guardar el product en el array de product del comercio
        await Shop.findByIdAndUpdate(
                shop,
                {$push: {products: product._id}},
                {new: true}
        )
        const {categoryName} = isCategory;

        const productResponse = { ...product.toObject(), categoryName};

        res.status(HTTP_RESPONSE.Created).json(productResponse);
    } catch (error) {
        console.log(error)
        res.status(HTTP_RESPONSE.InternalServerError).json({message:"Interal server error"})
    }
}

export const updateProduct = async(req: AuthenticatedRequest, res: Response) => {
    try {
        const productId = req.params.productId;
        const {category} = req.body;

        // TODO: pasar a middleware
        const product = await Product.findById(productId);
        if(!product) return res.status(404).json({message:"Producto no encontrado"});

        // TODO: pasar a middleware
        // Encontrar categoria
        if(!isObjectIdOrHexString(category)) return res.status(400).json({message:`id: ${category} formato incorrecto`});
        const isCategory = await Category.findById(category);
        if(!isCategory) return res.status(404).json({message:`Categoria con el id: ${category} no encontrado`});

        const file = req.file; // imagen

        if(file && file.path){
            //eliminar image anterior
            await cloudinary.uploader.destroy(product.publicId);
            const cloudinaryResponse = await cloudinary.uploader.upload(file.path, {
                resource_type: "auto",
                transformation: [
                    {height: 400, crop: "scale"},
                    {fetch_format: "webp"}
                ]
            });

            const {secure_url, public_id} = cloudinaryResponse;
            product.imgUrl = secure_url;
            product.publicId = public_id;
            await product.save();
        }

        const productUpdated= await Product.findByIdAndUpdate(productId, {...req.body}, {new: true});
        const {categoryName} = isCategory;

        const productResponse = { ...productUpdated?.toObject(), categoryName};

        res.status(HTTP_RESPONSE.Created).json(productResponse)    
    } catch (error) {
        console.log(error)
        res.status(HTTP_RESPONSE.InternalServerError).json({message:"Interal server error"})
    }
}

export const deleteProduct = async(req: AuthenticatedRequest, res: Response) => {
    try {
        const userId:any =  req.uid;
        const productId = req.params.productId;
        
        //Verificar si la tienda existe por ende el producto  --- pasar a middleware
        const isOwnerProduct = await Shop.findById(userId);
        if(!isOwnerProduct) return res.status(HTTP_RESPONSE.NotFound).json({message: "Producto no encontrado"});

        //Verificar si el producto a elminar pertenece a la tienda
        const isProduct = isOwnerProduct?.products.find((p:any) => p._id.toString() === productId && p);


        //Eliminar producto
        const product = await Product.findByIdAndDelete(isProduct);

        await Shop.findByIdAndUpdate(userId, {
            $pull: { products: isProduct }, // Elimina el productId del array products
        });

        if(product?.publicId){
            await cloudinary.uploader.destroy(product.publicId);
        }

        return res.json({message: "Producto eliminado correctamente"})

    } catch (error) {
        console.log(error)
    }
}


export const getProductByShop = async(  req: Request, res: Response) => {
    try {
        const {shopId} = req.params;

        if(!isObjectIdOrHexString(shopId)) return res.status(404).json({message:"Id del comercio incorrecto"});

        //Buscar el comercio por el id --- pasar a middleware
        const shop = await Shop.findById(shopId);
        if(!shop) return res.status(HTTP_RESPONSE.NotFound).json({message:"El comercio no existe"});

        const products = await Product.find({'shop': shopId}).populate("shop").populate("category");

        const formateddProducts = productResponseFormat(products);



        res.status(HTTP_RESPONSE.OK).json(formateddProducts);

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Interal server error"})
    }
}


export const getAllProductsByShop = async (req: Request, res: Response) => {
    try {

        const products = await Product.find({}).populate("shop").populate("category");

        const formateddProducts = productResponseFormat(products);
    
        res.status(HTTP_RESPONSE.OK).json(formateddProducts);
    } catch (error) {
        console.log(error);
        res.status(HTTP_RESPONSE.InternalServerError).json({ message: "Interal server error" });
    }
};


export const searchProduct = async(req:Request, res:Response) => {
    try {
        const query = req.query.q;
        if(!query) return res.status(HTTP_RESPONSE.NotFound).json({message: "No se proporciono parametro de busqueda"});
        const searchValue = query.toString();
                
        const regex = new RegExp(searchValue, 'i');

        const products = await Product.find({'title': {$regex: regex}}).populate("shop").populate("category");

        
        const formateddProducts = productResponseFormat(products);

    
        res.status(HTTP_RESPONSE.OK).json(formateddProducts);

    } catch (error) {
        console.log(error)
        res.status(HTTP_RESPONSE.InternalServerError).json({ message: "Interal server error" });
    }
}


export const getCart = async(req:JWTRequestI, res:Response) => {
    try {
        const cookiesCart = req.cookies[`cart-${req.uid}`]
        const cartArray:ProductI[] = [];
        const cartIds = cookiesCart ? JSON.parse(cookiesCart).map((cart:{_id:string}) => (cart._id)) : [];
        for (const idProduct of cartIds) {
            const product = await Product.findById(idProduct);
            const productInfo = JSON.parse(cookiesCart).find((p:ProductI) => (p._id === idProduct));

            const newProduct = {
                ...productInfo,
                price: product?.price,
                stock: product?.stock,
                title: product?.title,
                imgUrl: product?.imgUrl
            }
            cartArray.push(newProduct);
        }

        res.send(cartArray);
        
    } catch (error) {
        console.log(error);
    }
}


const productResponseFormat = (products: ProductI[]) => {
    const formattedProducts = products.map((product:ProductI) => {
        const {_id, title, price, description, stock, shop, imgUrl, category:categoryInfo} = product;

        const {shopName, _id:shopId} = shop as ShopI;
        const {categoryName, _id:category} = categoryInfo as CategoryI;

        return {_id, title, price, description, imgUrl,  stock, shopName, shopId , 
            categoryName, category}
    })
    return formattedProducts;
}






