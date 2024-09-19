import {ITutorRepository} from './ITutorRepository';
import {ITutor, ITemporaryTutor} from '../entities/ITutor'
import { Tutor } from "../../model/Tutor";
import {TemporaryTutor} from '../../model/TempTutor'
import bcrypt from 'bcryptjs';


export class TutorRepository implements ITutorRepository {
    async findByEmail(email: string): Promise<ITutor | null> {
        try{
            console.log('reachd userRepository findByEmail',email);
            const tutor = await Tutor.findOne({email:email}).exec()
            return tutor
        }catch(error){
            const err = error as Error;
            throw new Error(`Error finding user by email ${err.message} `)
        }
    }


    async findTempTutor(tempId: string): Promise<ITemporaryTutor | null> {
        try {
            console.log('reached userRepository findTempOtp', tempId);

            const temporaryTutor = await TemporaryTutor.findOne({ _id: tempId }).exec();

            if (!temporaryTutor) {
                return null;
            }
            
            return temporaryTutor as ITemporaryTutor;
        } catch (error) {
            const err = error as Error;
            throw new Error(`Error finding temporary user by tempId ${err.message}`);
        }
    }


    async save(tutor: ITutor) : Promise<ITutor> {
        try {
            console.log('save user in userrepository reached')
            const hashedPassword = await bcrypt.hash(tutor.password, 10)
            console.log('hashed password', hashedPassword);

            const tutorData = {...tutor,password : hashedPassword}

            console.log("finaldata--",tutorData)

            const newTutor = new Tutor(tutorData);

            await newTutor.save();

            return newTutor;
            
        } catch (error) {
            console.log("error in save userRepo")
            const err = error as Error;
            throw new Error(`Error finding temporary user by tempId ${err.message}`);
            
        }
    }

    async updateOtp(tempId: string, otp : string): Promise<ITemporaryTutor | null> {
        try {
            console.log("enetered updateOtp",tempId)

            const updateTemporaryUser = await TemporaryTutor.updateOne({ _id: tempId },{$set:{otp :otp}}).exec();

            console.log(updateTemporaryUser, " updated tempuser AFTER RESEND OTP ----")
  
            const temporaryTutor = await TemporaryTutor.findOne({ _id: tempId }).exec();

            console.log(temporaryTutor)

            if (!temporaryTutor) {    
                return null;
            }

            return temporaryTutor as ITemporaryTutor
            
            
        } catch (error) {
            console.log("error in save userRepo")
            const err = error as Error;
            throw new Error(`Error logging check user ${err.message}`);
        }
    }

    async checkTutor(email : string, password : string): Promise< ITutor | null >{
        try {
              console.log('login user in userrepository reached')
              const tutorData = await Tutor.findOne({email : email}) 

              console.log(tutorData)

           return tutorData

        } catch (error) {
          console.log("error in save userRepo")
          const err = error as Error;
          throw new Error(`Error logging check user ${err.message}`);
        }
  }


  async updatePassword(email : string, hashedPassword : string): Promise< ITutor | null >{
    try {
          console.log('login user in userrepository reached')
          const updateData = await Tutor.updateOne(
            { email: email },
            { $set: { password: hashedPassword } }
        );


          console.log(updateData)

          const tutorData = await Tutor.findOne({email : email}) 

       return tutorData

    } catch (error) {
      console.log("error in save userRepo")
      const err = error as Error;
      throw new Error(`Error logging check user ${err.message}`);
    }
}


async googleSave(tutor: ITutor) : Promise<ITutor> {
    try {
        console.log('save user in userrepository reached')

        const tutorData = {
            ...tutor,
            isBlocked: false // Adding the isBlocked field
        };
      
        const newTutor = new Tutor(tutorData);

        await newTutor.save();

        return newTutor;
        
    } catch (error) {
        console.log("error in save userRepo")
        const err = error as Error;
        throw new Error(`Error finding temporary user by tempId ${err.message}`);
        
    }
}


async totalTutors() : Promise<ITutor[]| null> {
    try {
        console.log(' total tutors  in tutorrepository reached')

      
        let tutorsData = await Tutor.find({}).exec();

        console.log(tutorsData)

        return tutorsData
        
    } catch (error) {
        console.log("error in save userRepo")
        const err = error as Error;
        throw new Error(`Error finding temporary user by tempId ${err.message}`);
        
    }
}


async isBlocked(email: string): Promise<{ success: boolean; message: string }> {
    try {
        console.log('Total students in userrepository reached', email);

        // Find the user by email
        const tutorData = await Tutor.findOne({ email: email });

        // If no user is found
        if (!tutorData) {
            return { success: false, message: 'User not found' };
        }

        console.log(tutorData, "Got user data for isBlocked");

        // Toggle the isBlocked status
        const isBlocked = !tutorData.isBlocked;

        // Update the user with the new isBlocked status
        await Tutor.updateOne({ email: email }, { $set: { isBlocked: isBlocked } });

        // Return success message based on the new status
        return {
            success: true,
            message: isBlocked ? "Successfully blocked the user" : "Successfully unblocked the user"
        };

    } catch (error) {
        console.log("Error in isBlocked function");
        const err = error as Error;
        return { success: false, message: `Error updating user status: ${err.message}` };
    }
}

}

