import mongoose, {Document,Types} from "mongoose";


export interface FetchTutorRequest {
  courseId: string; // The tutor ID to fetch
}


export interface FetchTutorResponse {
  tutors: {
    name: string;
    profile_picture: string; // S3 signed URL
    expertise: string;
  }[];
}

export interface ITutor {
  tutorname: string;
  email: string;
  phone?: string;
  password: string;
  profile_picture?: string;
  createdAt?: Date; // Updated to align with schema's 'createdAt' field
  about?: string;   // Optional field as per schema
  isBlocked?: boolean; // Optional field as per schema
  courses?: { // Array of courses with courseId and students array
      courseId: Types.ObjectId; // Assuming courseId is an ObjectId
      students: Types.ObjectId[]; // Array of student ObjectIds
  }[];
  expertise: string[];
}


 export interface PublicTutorData {
    tutorname: string;
    email: string;
    phone?: string;
    about?:string;
    profile_picture?: string;
    created_At?: Date;
    image?: string | { buffer: Buffer; originalname: string };
    isBlocked?: boolean;
  }
  
  export interface profile {
    data: { // Add this block
      tutorname: string;
        email: string;
        phone: string;
        about?: string;
        profile_picture?: { buffer: Buffer; originalname: string } | string;
    };
    created_At?: Date;
}



  export interface ITemporaryTutor extends Document {
    otp: string;
    tutorData?: ITutor;
    createdAt: Date;  // Consistent naming with Mongoose convention
}


export interface registerData {
  tutorname: string;
  email: string;
  password: string;
}

export interface tempId{
  id : string;
}

export interface tutorId{
  tutorId : string;
}


export interface LoginTutor{
  email : string;
  password : string;
}


export interface tutorMinData{
  email : string;
  tutorname : string;
}

export interface Email{
  email : string;
  newPassword?: string
}


export interface Email {
  email:string
}



export interface TutorAdditionalInfoPayload {
  id: string; 
  profilePicture: string | null;
  bio: string;
  cv: string | null;
  expertise: string[];
  qualifications: Qualification[];
}

export interface Qualification {
  qualification: string;
  certificate: string | null;
}


export interface Qualification2 {
  title: string;
  file: File | null;
  fileUrl: string;
}

export interface FormDataPayload {
  name: string;
  email: string;
  phone: string;
  about: string;
  qualifications: Qualification2[]; // Array of qualifications
  profile_picture?: string; // Optional, since it's only appended if available
  cv?: string; // Optional, since it's only appended if available
  profileImageFile?: File; // Optional, file input for profile image
  cvFile?: File; 
}
