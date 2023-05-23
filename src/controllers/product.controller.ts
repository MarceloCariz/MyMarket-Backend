import { Request, Response } from "express";
import Product, { ProductI } from "../models/Product";
import Shop, { ShopI } from "../models/Shop";
import { isObjectIdOrHexString } from "mongoose";
import cloudinary from "../utils/cloudinary.config";
import { AuthenticatedRequest } from "../middlewares/authorizeByRole.middleware";



export const createProduct = async (req: Request,res: Response) => {
    try {

        
        const {shop} = req.body;

        const file:any = req.file;

        if(!file) return res.status(404).json({message: "Imagen no encontrada"});

        //Verficar el id de la tienda
        const isShop = await Shop.findById(shop);
        if(!isShop) return res.status(404).json({message:`Comercio con el id: ${shop} no encontrado`});


        if(!req.file?.path) return  res.status(404).json({message: "Imagen no encontrada"});
        
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
        res.status(201).json(product)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Interal server error"})
    }
}

export const updateProduct = async(req: AuthenticatedRequest, res: Response) => {
    try {
        const productId = req.params.productId;
        // const {title, description, price, stock} = req.body;

        // Validar si 
        const product = await Product.findById(productId);
        if(!product) return res.status(404).json({message:"Producto no encontrado"});


        const file:any = req.file; // imagen

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

        const productUpdated = await Product.findByIdAndUpdate(productId, {...req.body}, {new: true});

        res.status(201).json(productUpdated)
    } catch (error) {
        console.log(error)
    }
}

export const deleteProduct = async(req: AuthenticatedRequest, res: Response) => {
    try {
        const userId:any =  req.uid;
        const productId = req.params.productId;
        
        //Verificar si la tienda existe por ende el producto 
        const isOwnerProduct = await Shop.findById(userId);
        if(!isOwnerProduct) return res.status(404).json({message: "Producto no encontrado"});

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


export const getProductByShop = async(req: Request, res: Response) => {
    try {
        const {shopId} = req.params;

        if(!isObjectIdOrHexString(shopId)) return res.status(404).json({message:"Id del comercio incorrecto"});

        //Buscar el comercio por el id
        const shop = await Shop.findById(shopId).populate({
            path: "products",
            populate:{
                path: "shop",
                select: "shopName"
            }
        });
        if(!shop){
            return res.status(404).json({message:"Aun no tienes productos"})
        }

        //Obtener los productos del comercio
        const products = shop.products;   

        res.status(200).json(products);

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Interal server error"})
    }
}


export const getAllProductsByShop = async (req: Request, res: Response) => {
    try {


        const products = await Product.find({}).populate("shop");

        const formateddProducts = products.map((product) => {
            const {_id, title, price, description, stock, shop, imgUrl} = product;

            const shopInfo:any = shop
            
            return {_id, title, price, description, imgUrl,  stock, shopName: shopInfo.shopName, shopId: shopInfo._id }
        })

    
        res.status(200).json(formateddProducts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Interal server error" });
    }
};


export const searchProduct = async(req:Request, res:Response) => {
    try {
        const query = req.query.q;
        if(!query) return res.status(404).json({message: "No se proporciono parametro de busqueda"});
        const searchValue = query.toString();
                
        const regex = new RegExp(searchValue, 'i');

        const products = await Product.find({'title': {$regex: regex}});

        res.status(200).json(products);

    } catch (error) {
        console.log(error)
    }
}




      // Realizar la agregación para agrupar los productos por comercio
        // const products = await Product.aggregate([
        //     {
        //         $group: {
        //             _id: "$shop",
        //             productos: { $push: "$$ROOT" }
        //         },
        //     }
        // ]);

// {
//     $lookup: {
//         from: "shops", // Nombre de la colección de comercios
//         localField: "_id",
//         foreignField: "_id",
//         as: "comercio"
//     }
// },
// {
//     $unwind: "$comercio"
// },
// {
//     $project: {
//         _id: 0, // Excluir el campo _id de los resultados
//         comercio: "$comercio.username", // Mostrar el campo "nombre" del comercio
//         productos: 1 // Mantener el campo "productos" en los resultados
//     }
// }