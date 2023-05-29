import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import User from "../models/User";
import Shop from "../models/Shop";
import Profile from "../models/Profile";
import { JWTRequestI } from "../middlewares/checkJWT.middleware";
import { HTTP_RESPONSE } from "../enums/httpErrors.enum";



export const createUser = async (req:Request, res:Response) => {
    try {
        // Buscar usuario
        const isUser = await User.findOne({email: req.body.email});
        const isShop = await Shop.findOne({email: req.body.email});

        //mandar mensaje si se encuentra
        if(isUser) return res.status(HTTP_RESPONSE.BadRequest).json({message:"El usuario ya existe"});
        if(isShop) return res.status(HTTP_RESPONSE.BadRequest).json({message:"El usuario ya existe"});


        //Crear el perfil
        const profile =  new Profile();
        await profile.save();


        //Crear el usuario
        const user = await User.create({...req.body, profile: profile._id});

        
        //Encriptar contrasena
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);


        //Guardar el usuario creado
        await user.save();

        //Enviar el usuario guardado desde la db
        res.status(HTTP_RESPONSE.Created).json(user);

    } catch (error) {
        console.log(error)
        res.status(HTTP_RESPONSE.InternalServerError).json({message: "Internal server Error"});
    }
}

export const updateProfile = async(req: JWTRequestI, res:Response) => {
    try {
        const body = req.body;
        const uid = req.uid;

        //Verficar usuario
        const user = await User.findById(uid).populate("profile");
        if(!user) return res.status(HTTP_RESPONSE.NotFound).json({message:"Usuario no encontrado"});

        const imagen = req.file;

        if(imagen){
            console.log(imagen)
        }

        //Buscar perfil del usuario / actualizar
        const profile = await Profile.findByIdAndUpdate(user.profile,{...req.body}, {new: true});

        

        res.status(HTTP_RESPONSE.Created).json(profile)

    } catch (error) {
        console.log(error)
        res.status(HTTP_RESPONSE.InternalServerError).json({message: "Internal server Error"});
    }
}

export const getProfile  = async(req: JWTRequestI, res: Response) => {
    try {
        const {uid} = req;

        const user = await User.findById(uid).populate("profile");
        if(!user) return res.status(HTTP_RESPONSE.NotFound).json({message:"Usuario no encontrado"});


        const profile = await Profile.findById(user.profile);

        res.status(HTTP_RESPONSE.OK).json(profile)

    } catch (error) {
        console.log(error)
        res.status(HTTP_RESPONSE.InternalServerError).json({message: "Internal server Error"});
    }
}

export const deleteUser = async(req:Request, res:Response) => {
    try {
        const uid = req.params.id;
        const user = await User.findById(uid);
        if(!user) return res.status(HTTP_RESPONSE.NotFound).json({message:"Usuario no encontrado"});
        await Profile.findByIdAndDelete(user.profile);
        await user.deleteOne();
        res.status(HTTP_RESPONSE.Created).json("deleted")
    } catch (error) {
        res.status(HTTP_RESPONSE.InternalServerError).json({message: "Internal server Error"});
    }
} 

export const updateUser = (req:Request, res:Response) => {
    try {
        res.send("correcto")
    } catch (error) {
        res.status(HTTP_RESPONSE.InternalServerError).json({message: "Internal server Error"});
    }
}

export const getUsers = async(req: Request, res:Response) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({message: "Internal server Error"});
    }
}




