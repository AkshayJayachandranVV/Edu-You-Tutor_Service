import {TutorService} from "../../application/use-case/tutor";
import {ITutor, registerData , tempId , LoginTutor, Email} from "../../domain/entities/ITutor";


class TutorController {
    private tutorService: TutorService

    constructor() {
        this.tutorService = new TutorService()
    }

    async registerTutor(data: ITutor){
        try{
            console.log(data, "register user");
            const result = await this.tutorService.registerTutor(data);
            console.log("result of register", result);
            return result;
        }catch(error){
            console.log("error in register user usercontroller", error);
        }
    }

    async verifyOtp(data:any){
        try{
            console.log(data,"verify_otp")

            const result = await this.tutorService.verifyOtp(data)
            console.log("result of verify-otp", result);
            return result;

        }catch(error){
            console.log("error in verifyotp user usercontroller", error);
        }
    }


    async resendOtp(data :tempId ){
        try {
            console.log(data, "resend otp");
            const result = await this.tutorService.resendOtp(data)

            console.log(result, "of the resendOtp")
            return result
        } catch (error) {
            console.log("error in resend otp in usercontroller", error);
        }
    }

    async loginTutor(data: LoginTutor){
        try{
            console.log(data, "login tutor");

            const result = await this.tutorService.loginTutor(data)

            return result
        }catch(error){
            console.log("error in login user usercontroller", error);
        }

    }

    async forgotPassword(data: any){
        try {
            
            console.log(data, "forgotPassword otp");
            const result = await this.tutorService.forgotPassword(data.email)

            console.log(result, "of the forgotPassword")
            return result

        } catch (error) {
            console.log("error in login user usercontroller", error);
        }
    }


    async forgotOtpVerify(data :Email ){
        try {
            console.log(data,"forgotttt-verify_otp")

            const result = await this.tutorService.forgotOtpVerify(data)
            console.log("result of verify-otp", result);
            return result;
        } catch (error) {
            console.log("error in resend otp in usercontroller", error);
        }
    }


    async resetPassword(data :Email ){
        try {
            console.log(data,"forgotttt-verify_otp")

            const result = await this.tutorService.resetPassword(data)
            console.log("result of verify-otp", result);
            return result;
        } catch (error) {
            console.log("error in resend otp in usercontroller", error);
        }
    }


    async googleLoginTutor(data: any){
        try{
            console.log(data, "login user");

            const result = await this.tutorService.googleLoginTutor(data)

            return result
        }catch(error){
            console.log("error in login user usercontroller", error);
        }

    }

    async totalTutors(data: any){
        try{
            console.log(data, "user edit profile");

            const result = await this.tutorService.totalTutors(data)

            return result
        }catch(error){
            console.log("error in login user usercontroller", error);
        }

    }


    async isBlocked(data: any){
        try{
            console.log(data, "admin isBLocked");

            const result = await this.tutorService.isBlocked(data)

            return result
        }catch(error){
            console.log("error in login user usercontroller", error);
        }

    }

}

export const tutorController = new TutorController()   

