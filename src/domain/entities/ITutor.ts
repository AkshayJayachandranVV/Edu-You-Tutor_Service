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
  expertise: string[];
  courses?: {
    courseId: mongoose.Types.ObjectId;
    students: mongoose.Types.ObjectId[];
  }[];
  about?: string;
  isBlocked?: boolean;
}

export interface ITutorDocument extends ITutor, Document<mongoose.Types.ObjectId> {}



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
    createdAt: Date;  
}


export interface GoogleLoginTutorRequest {
  email: string;
  fullname: string;
}

export interface GoogleLoginTutorResponse {
  success: boolean;
  message: string;
  tutor_data?: ITutor; 
  role?:string;
}

export interface registerData {
  tutorname: string;
  email: string;
  password: string;
}

export interface RegisterTutorResponse {
  success: boolean;
  message: string;
  forgotPass?: boolean;
  email?: string;
  tempId?: string;
  tutorData?:ITutor;
}

export interface VerifyOtpInput {
  otp: string;
  id: string;
}

export interface VerifyOtpUserResponse {
  message: string;
  success: boolean;
  tutor_data?: ITutor; 
}


export interface LoginTutorRequest {
  email: string;
  password: string;
}

export interface LoginTutorrResponse {
  success: boolean;
  message: string;
  role: string;
  tutorData?: ITutor; 
}


export interface TemporaryUser {
  success:boolean;
  message:string;
  tutor_data?:ITutor;
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
  qualifications: Qualification2[]; 
  profile_picture?: string; 
  cv?: string; 
  profileImageFile?: File;
  cvFile?: File; 
}


export interface PaginationData {
  skip: number;
  limit: number;
}

export interface TutorWithDynamicProperties {
  tutorId: string;        // The tutor's unique identifier
  [key: string]: any;     // Allow any additional properties with any key and value
}



export interface TutorProfile {
  tutorname: string; // Full name of the tutor
  email: string;
  phone?: string; // Optional
  about?: string; // Optional
  qualifications?: string[]; // Optional
  profile_picture: string; // Profile picture URL or S3 key
  cv?: string; // Optional
}




export interface AddCourseStudentRequest {
  tutorId: string;
  userId: string;
  courseId: string;
}


export interface ResetPasswordInput {
  newPassword: string;
  email: string;
}

export interface totalTutorsResponse {
  totalCount:number;
  tutors:ITutor[]
} 

export interface totalStudentsResponse {
  success:boolean;
  students:string[]
} 



export interface ReturnResponse {
  message:string;
  success:boolean;
}


export interface GoogleLoginTutorRequest {
  email: string;
  fullname: string;
}

export interface GoogleLoginTutorResponse {
  success: boolean;
  message: string;
  tutor_data?: ITutor; 
  role?:string;
}


export interface EditProfileRequest {
  data: {
    name: string;
    email: string;
    phone?: string;
    about?: string;
    profile_picture?: string; 
  };
}


