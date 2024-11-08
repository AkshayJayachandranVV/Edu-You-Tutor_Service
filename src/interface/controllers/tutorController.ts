import {TutorService} from "../../application/use-case/tutor";
import {ITutor, registerData , tempId , tutorId, Email} from "../../domain/entities/ITutor";
import * as grpc from '@grpc/grpc-js';

class TutorController {
    private tutorService: TutorService

    constructor() {
        this.tutorService = new TutorService()
    }

    async registerTutor(call: any, callback: any): Promise<void> {
        try {
            console.log("Reached registerTutor method", call.request);
    
            // Extract tutor data from gRPC request
            const tutorData = call.request;
    
            // Call the tutorService's registerTutor method, passing the tutor data
            const result = await this.tutorService.registerTutor(tutorData);
    
            console.log("Result of register", result);
    
            // Check the result and call the callback with appropriate response
            if (result && result.success) {
                return callback(null, {
                    success: true,
                    message: result.message || 'Registration successful. Verify the OTP to complete registration.',
                    tutorData: result.tutorData, // Return tutor data if needed
                    tempId: result.tempId, // Assuming tempId is returned for OTP verification
                });
            } else {
                return callback(null, {
                    success: false,
                    message: result.message || 'Registration failed. Please try again.',
                });
            }
        } catch (error) {
            console.log("Error in registerTutor method:", error);
    
            // Return an error in case something goes wrong
            return callback({
                code: grpc.status.INTERNAL,
                message: error instanceof Error ? error.message : 'Unknown error occurred',
            });
        }
    }
    

    async verifyOtp(call: any, callback: any): Promise<void> {
        try {
            console.log("Received gRPC verifyOtp request for tutor", call.request);
    
            // Extract otp and id from gRPC request
            const { otp, id } = call.request;
    
            // Call the tutorService's verifyOtp method, passing otp and id
            const result = await this.tutorService.verifyOtp({ otp, id });
            console.log("Result of tutor verify-otp:", result);
    
            // Check if OTP verification was successful and return the result via callback
            if (result && result.success) {
                return callback(null, {
                    success: true,
                    message: "OTP verified. Tutor registered successfully",
                    tutor_data: result.tutor_data, // Include tutor data if needed
                });
            } else {
                // Handle incorrect OTP case or other failures
                if (result.message === "Incorrect Otp") {
                    return callback(null, {
                        success: false,
                        message: "Incorrect OTP",
                    });
                } else {
                    return callback(null, {
                        success: false,
                        message: "Tutor registration failed. Please try again.",
                    });
                }
            }
        } catch (error) {
            console.error("Error in tutor verifyOtp gRPC method", error);
    
            // Return an error in case something goes wrong
            return callback({
                code: grpc.status.INTERNAL,
                message: error instanceof Error ? error.message : 'Unknown error occurred',
            });
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

    // async loginTutor(data: LoginTutor){
    //     try{
    //         console.log(data, "login tutor");

    //         const result = await this.tutorService.loginTutor(data)

    //         return result
    //     }catch(error){
    //         console.log("error in login user usercontroller", error);
    //     }

    // }

    async loginTutor(call: any, callback: any): Promise<void> {
        try {
            console.log("reached-------------------------------------------", call.request);
    
            // Extract email and password from gRPC request
            const { email, password } = call.request;
    
            // Call the tutorService's loginTutor method, passing both email, password, and callback
            await this.tutorService.loginTutor({ email, password }, callback);
        } catch (error) {
            console.log(error, "in grpc");
    
            // Return an error in case something goes wrong
            return callback({
                code: grpc.status.INTERNAL,
                message: error instanceof Error ? error.message : 'Unknown error occurred',
            });
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


    async googleLoginTutor(call: any, callback: any): Promise<void> {
        try {
            console.log("Reached googleLoginTutor gRPC handler", call.request);
    
            // Extract email and fullname from gRPC request
            const { email, fullname } = call.request;
    
            // Call the tutorService's googleLoginTutor method
            const result = await this.tutorService.googleLoginTutor({ email, fullname });
    
            // Send the result back using callback
            return callback(null, result); // result should match the structure of GoogleLoginTutorResponse
        } catch (error) {
            console.log("Error in googleLoginTutor gRPC handler", error);
    
            // Return an error in case something goes wrong
            return callback({
                code: grpc.status.INTERNAL,
                message: error instanceof Error ? error.message : 'Unknown error occurred',
            });
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


    async editProfile(data: any){
        try{
            console.log(data, "user edit profile");

            const result = await this.tutorService.editProfile(data)

            return result
        }catch(error){
            console.log("error in login user usercontroller", error);
        }

    }



    async tutorDetails(data: any){
        try{
            console.log(data, "tutor details ");

            const result = await this.tutorService.tutorDetails(data)

            return result
        }catch(error){
            console.log("error in login user usercontroller", error);
        }

    }


    async addCourseStudents(data: any){
        try{
            console.log(data, "tutor details ");

            const result = await this.tutorService.addCourseStudents(data)

            return result
        }catch(error){
            console.log("error in login user usercontroller", error);
        }

    }


    async courseStudents(data: any){
        try{
            console.log(data, "tutor details ");

            const result = await this.tutorService.courseStudents(data)

            return result
        }catch(error){
            console.log("error in login user usercontroller", error);
        }

    }
   

    async cardsData(data:tutorId){
        try{
            console.log(data, "tutor details ");

            const result = await this.tutorService.cardsData(data)

            return result
        }catch(error){
            console.log("error in login user usercontroller", error);
        }

    }


    async tutorPieGraph(data:tutorId){
        try{
            console.log(data, "tutor details ");

            const result = await this.tutorService.tutorPieGraph(data)
            return result
        }catch(error){
            console.log("error in login user usercontroller", error);
        }

    }

}

export const tutorController = new TutorController()   




