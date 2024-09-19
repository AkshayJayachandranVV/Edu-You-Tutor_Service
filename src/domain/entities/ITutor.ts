import mongoose, {Document} from "mongoose";


export interface ITutor {
  tutorname: string;
    email: string;
    phone?: string;
    password: string;
    profile_picture?: string;
    created_At?: Date;
    image?: { buffer: Buffer; originalname: string } | string;
    isBlocked?:boolean;
  }


 export interface PublicTutorData {
    tutorname: string;
    email: string;
    phone?: string;
    profile_picture?: string;
    created_At?: Date;
    image?: string | { buffer: Buffer; originalname: string };
    isBlocked?: boolean;
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