import mongoose,{Document,Schema} from "mongoose";
import {ITutor} from "../domain/entities/ITutor"

export interface ITemporaryTutor extends Document{
    _id: mongoose.Types.ObjectId;
    otp: string;
    tutorData?: ITutor;
    createdAt: Date;
}


const TemporaryTutorSchema: Schema = new Schema({
    otp : {type: String,required:true},
    tutorData: {type: Object as any, required: false},
    createdAt: {type: Date, default: Date.now(), expires: 900} 
})

export const TemporaryTutor = mongoose.model<ITemporaryTutor>(
    "TemporaryTutor",
    TemporaryTutorSchema
)