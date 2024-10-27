import mongoose, {Document,Types} from "mongoose";


// export interface ITutor {
//     tutorname: string;
//     email: string;
//     phone?: string;
//     password: string;
//     profile_picture?: string;
//     created_At?: Date;
//     image?: { buffer: Buffer; originalname: string } | string;
//     isBlocked?:boolean;
//   }

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