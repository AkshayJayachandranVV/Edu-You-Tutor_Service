import mongoose, { Document, Schema } from "mongoose";
import { ITutor } from "../domain/entities/ITutor";

export interface ITutorDocument extends ITutor, Document {}


const TutorSchema: Schema = new Schema({
    tutorname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    profile_picture: {
        type: String 
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    about: {
        type: String
    },
    isBlocked: {
        type: Boolean
    },
    courses: [{
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true
        },
        students: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        }]
    }],
    
    expertise: [{
        type: String
    }],
    qualifications: [{
        qualification: {
            type: String,
            required: true
        },
        certificate: {
            type: String 
        }
    }],
    bio: {
        type: String
    },
    cv: {
        type: String 
    }
});

// Create the Tutor model
export const Tutor = mongoose.model<ITutorDocument>('Tutor', TutorSchema);
