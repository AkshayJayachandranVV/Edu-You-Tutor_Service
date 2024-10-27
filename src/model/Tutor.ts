import mongoose, { Document, Schema } from "mongoose";
import { ITutor } from "../domain/entities/ITutor";

export interface ITutorDocument extends ITutor, Document {}

// Define the Tutor schema
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
    // Add the Courses array
    courses: [{
        courseId: {
            type: mongoose.Schema.Types.ObjectId,  // Assuming courseId is an ObjectId from a Course model
            ref: 'Course',  // Reference the Course model if available
            required: true
        },
        students: [{
            type: mongoose.Schema.Types.ObjectId,  // Assuming studentId is an ObjectId from a Student model
            ref: 'Student'  // Reference the Student model if available
        }]
    }]
});

// Create the Tutor model
export const Tutor = mongoose.model<ITutorDocument>('Tutor', TutorSchema);
