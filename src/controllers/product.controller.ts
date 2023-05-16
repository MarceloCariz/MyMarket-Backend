import { Request, Response } from "express";
import Product, { ProductI } from "../models/Product";
import Shop, { ShopI } from "../models/Shop";
import { isObjectIdOrHexString } from "mongoose";



export const createProduct = async (req: Request,res: Response) => {
    try {
        const {shop} = req.body;
        //Verficar el id de la tienda
        const files:any = req.files;
        if(!files) return res.status(404).json({message: "Imagen no encontrada"});

        // const imagen = req.files.image[0].filename;

        const isShop = await Shop.findById(shop);
        if(!isShop) return res.status(404).json({message:`Comercio con el id: ${shop} no encontrado`});

        const imageUrl  = files.image[0].filename

        const newProduct:ProductI = {
            ...req.body,
            imgUrl: `${process.env.HOST}/img/${imageUrl}`,
        }

        const product =  await Product.create(newProduct);
        await product.save();

        //Guardar el product en el array de product del comercio
        await Shop.findByIdAndUpdate(
            shop,
            {$push: {products: product._id}},
            {new: true}
        )
        res.status(201).json(product)
    } catch (error) {
        res.status(500).json({message:"Interal server error"})
    }
}


export const getProductByShop = async(req: Request, res: Response) => {
    try {
        const {shopId} = req.params;

        if(!isObjectIdOrHexString(shopId)) return res.status(404).json({message:"Id del comercio incorrecto"});

        //Buscar el comercio por el id
        const shop = await Shop.findById(shopId).populate("products");
        if(!shop){
            return res.status(404).json({message:"Comercio no encontrado"})
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