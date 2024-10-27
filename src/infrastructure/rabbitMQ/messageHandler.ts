import {tutorController} from '../../interface/controllers/tutorController'
import RabbitMQClient from './client'


export default class MessageHandlers {
    static async handle(operations : string, data : any, correlationId : string, replyTo:string){
        let response
        switch(operations){
            // case 'register_tutor' :
            //     console.log('Handling operation',operations,data);
            //     response = await tutorController.registerTutor(data)
            //     console.log("data reached inside message handler.ts",response);
            //     break;

            // case 'tutor-verify_otp' :
            //     console.log('Handling operation',operations,data);
            //     response = await tutorController.verifyOtp(data)
            //     console.log("data reached inside message handler.ts",response);
            //     break; 

            case 'tutor-resend_otp' :
                console.log('Handling operation',operations,data);
                response = await tutorController.resendOtp(data)
                console.log("data reached inside message handler.ts",response);
                break;

            // case 'login_tutor' :
            //     console.log('Handling operation',operations,data);
            //     response = await tutorController.loginTutor(data)
            //     console.log("data reached inside message handler.ts",response);
            //     break;

            case 'forgotPassword_tutor' :
                console.log('Handling operation',operations,data);
                response = await tutorController.forgotPassword(data)
                console.log("data reached inside message handler.ts",response);
                break;

            case 'tutor-forgot-otp-verify' :
                console.log('Handling operation',operations,data);
                response = await tutorController.forgotOtpVerify(data)
                console.log("data reached inside message handler.ts",response);
                break;

            case 'tutor-reset-password' :
                console.log('Handling operation',operations,data);
                response = await tutorController.resetPassword(data)
                console.log("data reached inside message handler.ts",response);
                break;

            // case 'google-login_tutor' :
            //     console.log('Handling operation',operations,data)
            //     response = await tutorController.googleLoginTutor(data)
            //     console.log("data reached ",response);
            //     break;
            case 'admin-tutors' :
                console.log('Handling operation',operations,data)
                response = await tutorController.totalTutors(data)
                console.log("data reached ",response);
                break;
            case 'admin-tutorIsBlocked' :
                console.log('Handling operation',operations,data)
                response = await tutorController.isBlocked(data)
                console.log("data reached ",response);
                break;
            case 'tutor-edit_profile' :
                console.log('Handling operation',operations,data)
                response = await tutorController.editProfile(data)
                console.log("data reached ",response);
                break;

            case 'tutor-details' :
                console.log('Handling operation',operations,data)
                response = await tutorController.tutorDetails(data)
                console.log("data reached ",response);
                break;

            case 'update-course-students' :
                console.log('Handling operation',operations,data)
                response = await tutorController.addCourseStudents(data)
                console.log("data reached ",response);
                break;

            case 'tutor-course-students' :
                console.log('Handling operation',operations,data)
                response = await tutorController.courseStudents(data)
                console.log("data reached ",response);
                break;
                                           

        }

        await RabbitMQClient.produce(response,correlationId,replyTo)

    }
}









