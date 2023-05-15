import { Schema, model } from "mongoose";
import {RolesEnum} from '../enums/user.enum';

export interface UserI{
    username: string,
    email: string,
    password:string,
    roles: RolesEnum[]
}


const UserSchema = new Schema<UserI>({
    username:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    roles:{
        type: [String],
        enum: Object.values(RolesEnum),
        required: true
    }
});


export default model('user', UserSchema);