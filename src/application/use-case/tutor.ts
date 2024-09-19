import { TutorRepository } from "../../domain/repositories/TutorRepository";
import { ITutor, tempId , LoginTutor, tutorMinData, Email, PublicTutorData} from "../../domain/entities/ITutor";
import { generateOtp } from "../../utils/generateOtp";
import { sendOtpEmail } from "../../utils/sendEmail";
import { TemporaryTutor } from "../../model/TempTutor";
import bcrypt from "bcryptjs";
import mongoose, { Document } from "mongoose";



export class TutorService {
    private tutorRepo : TutorRepository;

    constructor() {
        this.tutorRepo = new TutorRepository();
      }

      async registerTutor(tutorData: ITutor): Promise<any> {
            try{
                console.log("reached tutor.ts in tutorcase");
                const TutorExist = await this.tutorRepo.findByEmail(tutorData.email);
                console.log("tutor found", TutorExist);
                if (TutorExist) {
                    return { success: false, message: "Email already registered" };
                  } else {
                    const otp = generateOtp();

                    console.log("generated OTP", otp);

                    const forgotPass: boolean = false;

                    await sendOtpEmail(tutorData.email, otp);

                    const temporaryTutor = new TemporaryTutor({
                      otp: otp,
                      tutorData: tutorData,
                      createdAt: Date.now(),
                    });

                    await temporaryTutor.save();
            
                    if (temporaryTutor) {
                      const tempId = temporaryTutor._id.toString(); // Convert ObjectId to string if needed
                      return {
                        message: "Verify the otp to complete registeration",
                        forgotPass,
                        success: true,
                        email : tutorData.email,
                        tempId,
                      };
                      // return { success: true, message: "Verification email sent", tempId, email};
                    } else {
                      throw new Error("Failed to create temporary tutor data.");
                    }
                  }
            }catch(error){
                if (error instanceof Error) {
                    throw new Error(`Error saving tutor:${error.message}`);
                  }
                  throw error;
                }
      }



      async verifyOtp(otpObj: any): Promise<any> {
        try {
          const { otp, id } = otpObj;
          console.log(otp, id);
          console.log("Verifying OTP", otp);
          const temporaryTutor = await this.tutorRepo.findTempTutor(id);
    
          console.log(temporaryTutor, " checvking its validity");
    
          if (!temporaryTutor) {
            return { success: false, message: "Invalid OTP" };
          }
    
          if(otp !== temporaryTutor.otp){
            console.log("enetered to invalid otp")
            return {
                success: false,
                message: "Incorrect Otp",
              };
          }
    
          const tutorData = temporaryTutor.tutorData;

          console.log()
    
          if (!tutorData) {
            return {
              success: false,
              message: "User data is missing in the temporary record",
            };
          }
    
          const savedTutor = await this.tutorRepo.save(tutorData);
    
          return {
            message: "User data saved successfully",
            success: true,
            tutor_data: savedTutor,
          };
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(`Error saving user:${error.message}`);
          }
          throw error;
        }
      }
      

      async resendOtp(data: tempId): Promise<{ success: boolean; forgotPass?: boolean, message: string; tutorData?: ITutor , id?: mongoose.Types.ObjectId  }> {
        try {
          console.log("Resend otp has entered", data);
    
          const tempId = data.id;
    
          const result = await this.tutorRepo.findTempTutor(tempId);
    
          console.log(result, "result of the resendotp");
    
      
          if(!result){
                 return { success: false, message: " Temporary Userdata not found" };
    
          }
    
          if(!result.tutorData){
          
            return { success: false, message: " Userdata not found" };
            }
                let tutorData = result.tutorData
                const otp = generateOtp();
    
                const forgotPass: boolean = false;
                await sendOtpEmail(result.tutorData.email, otp);
    
                const updateOtp = await this.tutorRepo.updateOtp(tempId,otp);

                console.log(updateOtp, "checking otp change ddhmo di fir=ed or not---------")
    
                return {
                    message: "Verify the otp to complete registeration",
                    forgotPass,
                    success: true,
                    tutorData,
                    id: new mongoose.Types.ObjectId(tempId),
                  };
    
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(`Error saving user:${error.message}`);
          }
          throw error;
        }
      }
    

      async loginTutor(data: LoginTutor): Promise<{ success: boolean; message: string; tutorData?: PublicTutorData; role?: string }> {
        try {
          const { email, password } = data;
      
          const tutorData = await this.tutorRepo.checkTutor(email, password);
      
          console.log(tutorData, "data from tutorRepo");
      
          if (!tutorData) {
            return { success: false, message: "Email incorrect" };
          }
      
          // Check if the tutor is blocked
          if (tutorData.isBlocked) {
            return { success: false, message: "User is Blocked" };
          }
      
          // Check if userData exists and has a password
          const storedPassword = tutorData.password;
      
          console.log(storedPassword, "stored password in tutorData");
      
          if (!storedPassword) {
            return { success: false, message: "Password not found for user" };
          }
      
          const isPassword = await bcrypt.compare(password, storedPassword);
      
          console.log(isPassword);
      
          if (!isPassword) {
            console.log("password unmatched");
            return { success: false, message: "Incorrect Password" };
          } else {
            console.log("successfully logged in", tutorData);
      
            // Remove sensitive data before returning if needed
            const { password, ...tutorDataWithoutPassword } = tutorData;
      
            return {
              success: true,
              message: "Login successful",
              tutorData: tutorDataWithoutPassword, // Send tutor data without password
              role: "tutor",
            };
          }
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(`Error logging in tutor: ${error.message}`);
          }
          throw error;
        }
      }
      


      async forgotPassword(email: string): Promise<{ forgotPass?: boolean, tutor?:tutorMinData , success: boolean, message: string, tempId?: string }>{
        try {
            console.log("Forgot Passowrd has entered", email);

            const tutor = await this.tutorRepo.findByEmail(email);
            console.log('kkkkkkkkkkkkk', tutor)

            if(tutor){
                const forgotPass: boolean = true; 

                const otp = generateOtp();

                console.log(otp,"Gpot the OT[P---")

                const tempData = new TemporaryTutor({
                    otp: otp,
                    tutorData: tutor,
                    createdAt: new Date()
                })

                await tempData.save()

                console.log(tempData, " ------" )

                await sendOtpEmail(email,otp)

                const tutorData = {
                    email : tutor.email,
                    tutorname : tutor.tutorname
                }

                const tempId = tempData._id.toString(); 

                return { forgotPass:forgotPass, tutor:tutorData , success: true, message: "Found user with this email" ,tempId :tempId}
            }else{
                return { success: false, message: "No user found with this email" };
            }

            
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error saving user:${error.message}`);
              }
              throw error;
        }
  }




  async forgotOtpVerify(otpObj: any): Promise<any> {

    try {

      const { otp, id } = otpObj;
      console.log(otp, id);
      console.log("Verifying OTP", otp);
      const temporaryTutor = await this.tutorRepo.findTempTutor(id);

      console.log(temporaryTutor, " checvking its validity");

      if (!temporaryTutor) {
        return { success: false, message: "Invalid OTP" };
      }

      if(otp !== temporaryTutor.otp){
        console.log("enetered to invalid otp")
        return {
            success: false,
            message: "Incorrect Otp",
          };
      }

      return {
        message: "Tutor data saved successfully",
        success: true,
      };
      
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error saving user:${error.message}`);
      }
      throw error;
    }

 }



 async resetPassword(data: any): Promise<any> {
  try {
      const {newPassword,email} = data;
      console.log("eneterd to reset . ",newPassword,email)
      const TutorExist = await this.tutorRepo.findByEmail(email);

      if(!TutorExist){
        return { success: false, message: "User Does not Exist" };
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)
      console.log('hashed password', hashedPassword);

      const updatePassword = await this.tutorRepo.updatePassword(email,hashedPassword);

      console.log(updatePassword)

      if(!updatePassword){
        return { success: false, message: "Password not updated" };
      }

      return { success: true, message: "succesfully updated password" };

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error saving user:${error.message}`);
    }
    throw error;
  }
}


async googleLoginTutor(data: any): Promise<any> {
  try {
      const email = data.email;
      const tutorname = data.fullname;
      let tutor = await this.tutorRepo.findByEmail(email);
      if (!tutor) {
          tutor = await this.tutorRepo.googleSave({
              email,
              tutorname,
              password: 'defaultpassword',
          } as ITutor)
      }
      console.log(tutor.isBlocked);
      if (tutor.isBlocked) {
          console.log('isblocked----------------if')
          return { success: false, message: 'You have been blocked by the admin', tutor_data: tutor  };
      } else {
          console.log('isblocked----------------else')
          return { success: true, message: 'Logged in successful', tutor_data: tutor  };
      }


  } catch (error) {
      if (error instanceof Error) {
          throw new Error(`Error logging in with Google: ${error.message}`);
      }
      throw error;
  }
}


async totalTutors(data: any): Promise<ITutor[]| null> {
  try {
      console.log(data, "data in students list");
      
      const tutors = await this.tutorRepo.totalTutors();
      return tutors;

  } catch (error) {
      if (error instanceof Error) {
          throw new Error(`Error editing profile: ${error.message}`);
      }
      throw error;
  }
}


async isBlocked(data: Email): Promise<any> {
  try {
      console.log(data, "data in students list");
      const {email} = data
      
      const isBlocked = await this.tutorRepo.isBlocked(email);
      return isBlocked;

  } catch (error) {
      if (error instanceof Error) {
          throw new Error(`Error editing profile: ${error.message}`);
      }
      throw error;
  }
}



}










