import { Schema, SchemaDefinitionProperty, model } from "mongoose";


export interface ProfileI {
    profileImg?: string;
    name: string;
    lastName: string;
    address: string;
    publicId: string; /// id cloudinary image
    longitude: number;
    latitude: number;
}


const ProfileSchema = new Schema<ProfileI>({
    profileImg: {
        type: String
    },
    name: {
        type: String
    },
    lastName: {
        type: String
    },
    address: {
        type: String
    },
    publicId:{
        type: String
    },
    longitude: {
        type: Number
    },
    latitude: {
        type: Number
    }

});


export default model('Profile', ProfileSchema);
