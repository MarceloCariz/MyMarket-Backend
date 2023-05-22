import { Schema, SchemaDefinitionProperty, model } from "mongoose";
import {RolesEnum} from '../enums/user.enum';

export interface UserI{
    username: string,
    email: string,
    password:string,
    profile: SchemaDefinitionProperty<string>,
    roles: RolesEnum[],
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
    profile: {
        type: Schema.Types.ObjectId, ref: "Profile", required: true
    },
    roles:{
        type: [String],
        required: true
    }
});


export default model('User', UserSchema);