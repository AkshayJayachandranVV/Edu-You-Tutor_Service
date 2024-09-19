import mongoose,{Document,Schema} from "mongoose";

import { ITutor } from "../domain/entities/ITutor";

export interface ITutorDocument extends ITutor,Document{}


const TutorSchema : Schema = new Schema({
    tutorname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now()
    },
    about:{
        type:String,
        required:false
    },
    isBlocked:{
        type:Boolean,
        required:false
    },
})


export const Tutor = mongoose.model<ITutorDocument>('Tutor',TutorSchema)