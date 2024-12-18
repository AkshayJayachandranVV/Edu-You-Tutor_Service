import {ITutorRepository} from './ITutorRepository';
import { Types } from 'mongoose';
import {ITutor, ITemporaryTutor,FetchTutorResponse,FetchTutorRequest,TutorAdditionalInfoPayload,tutorId,PaginationData,TutorProfile,
    AddCourseStudentRequest,totalTutorsResponse,TutorWithDynamicProperties
} from '../entities/ITutor'
import { Tutor } from "../../model/Tutor";
import {TemporaryTutor} from '../../model/TempTutor'
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';


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
              console.log('login user in userrepository reached',email)
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


async totalTutors(data:PaginationData) : Promise<totalTutorsResponse> {
    try {
        console.log(' total tutors  in tutorrepository reached')

        const {skip,limit} = data
        let tutorsData = await Tutor.find({}).skip(skip).limit(limit).exec();

        const totalCount = await Tutor.countDocuments();

        console.log(tutorsData)

        return {totalCount,tutors:tutorsData}
        
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



async editProfile(tutor: any): Promise<ITutor> {
    try {
        console.log('edit profile in userrepository reached');

        const { name, email, phone, about, qualifications, profile_picture, cv,expertise} = tutor;

        // Helper function to extract the S3 key from a URL
        const extractS3Key = (url: string): string => {
            const match = url.match(/uploads\/.+$/);
            return match ? match[0] : ''; // Return the key or an empty string if not found
        };

        // Parse qualifications and extract keys
        let qualificationsData = [];
        if (typeof qualifications === 'string') {
            try {
                // Ensure qualifications are parsed correctly
                const parsedQualifications = JSON.parse(qualifications);

               

                qualificationsData = parsedQualifications.map((qual: any) => ({
                    qualification: qual.title,
                    certificate: extractS3Key(qual.fileKey), // Reference 'fileKey' instead of 'fileUrl'
                }));
            } catch (error) {
                throw new Error('Invalid qualifications format');
            }
        } else if (Array.isArray(qualifications)) {
            qualificationsData = qualifications.map((qual: any) => ({
                qualification: qual.title,
                certificate: extractS3Key(qual.fileKey), // Reference 'fileKey' instead of 'fileUrl'
            }));
        } else {
            throw new Error('Qualifications must be an array or a JSON string');
        }

        const parsedExpertise = JSON.parse(expertise);

        // Prepare the update payload with extracted keys
        const updatePayload: any = {
            tutorname: name,
            phone,
            about,
            qualifications: qualificationsData,
            expertise:parsedExpertise,
            profile_picture: extractS3Key(profile_picture), // Extract S3 key for profile picture
            cv: extractS3Key(cv), 
        };

        // Update tutor profile in the database
        const updateProfile = await Tutor.updateOne({ email }, { $set: updatePayload }).exec();

        console.log('Profile updated:', updateProfile);

        // Fetch the updated tutor data (excluding password)
        const tutorData = await Tutor.findOne({ email }).select('-password');

        console.log('Fetched updated tutor data:', tutorData);

        // Handle the case where no tutor is found
        if (!tutorData) {
            throw new Error('Tutor not found');
        }

        // Cast the result to ITutor and return
        return tutorData as ITutor;
    } catch (error) {
        console.error('Error in save userRepo:', error);
        throw new Error(`Error updating tutor profile: ${error instanceof Error ? error.message : error}`);
    }
}






async tutorDetails(tutorId: string): Promise<ITutor | null> {
    try{
        console.log('reachd userRepository id',tutorId);
        const tutor = await Tutor.findOne({_id:tutorId}).exec()
        return tutor
    }catch(error){
        const err = error as Error;
        throw new Error(`Error finding user by email ${err.message} `)
    }
}


async addCourseStudents(data: AddCourseStudentRequest): Promise<ITutor> {
    try {
        const { tutorId, userId, courseId } = data;

        // Convert strings to ObjectId
        const tutorObjectId = new Types.ObjectId(tutorId);
        const userObjectId = new Types.ObjectId(userId);
        const courseObjectId = new Types.ObjectId(courseId);

        console.log('Reached addCourseStudents with ObjectId data:', {
            tutorObjectId,
            userObjectId,
            courseObjectId,
        });

        // Find the tutor by tutorId
        const tutor = await Tutor.findById(tutorObjectId);

        if (!tutor) {
            throw new Error('Tutor not found');
        }

        if (!tutor.courses) {
            tutor.courses = [];
        }

        // Check if the course already exists in the tutor's courses array
        const courseIndex = tutor.courses.findIndex(
            (course) => course.courseId.equals(courseObjectId)
        );

        if (courseIndex > -1) {
            // Course exists, check if student is already in the students array
            const studentsArray = tutor.courses[courseIndex].students;

            if (!studentsArray.some((student) => student.equals(userObjectId))) {
                // Add the student if not already enrolled
                studentsArray.push(userObjectId);
            } else {
                console.log('Student is already enrolled in the course');
            }
        } else {
            // Course does not exist, add a new one
            tutor.courses.push({
                courseId: courseObjectId,
                students: [userObjectId],
            });
        }

        // Save the updated tutor document
        const updatedTutor = await tutor.save();
        console.log('Updated tutor:', updatedTutor);

        return updatedTutor as ITutor;
    } catch (error) {
        const err = error as Error;
        console.error('Error in addCourseStudents:', err.message);
        throw new Error(`Error adding student to course: ${err.message}`);
    }
}




async courseStudents( courseId: string ): Promise<{ students: string[] } | null> {
    console.log('Reached userRepository with courseId:', courseId); // Verify the value
  
    try {
      const tutor = await Tutor.findOne(
        { 'courses.courseId': courseId }, 
        { 'courses.$': 1 } 
      ).exec();
  
      if (tutor && tutor.courses?.[0]?.students) {
        const studentIds = tutor.courses[0].students.map((studentId) => studentId.toString());
        return { students: studentIds };
      }
  
      return null;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Error fetching students by courseId: ${err.message}`);
    }
  }
  


  async cardsData(tutorId: string) {
    console.log('Reached userRepository with tutorId:', tutorId);

    try {
        // Convert tutorId to ObjectId to ensure it is correctly formatted for MongoDB.
        const result = await Tutor.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(tutorId) } },

            {
                $project: {
                    _id: 0,
                    totalCourses: { $size: "$courses" }, // Count courses in the courses array
                    totalStudents: {
                        $sum: {
                            $map: {
                                input: "$courses",
                                as: "course",
                                in: { $size: "$$course.students" }
                            }
                        }
                    }
                }
            }
        ]);

        console.log("Aggregation result:", result);

      
        return {
            totalCourses: result[0]?.totalCourses || 0,
            totalStudents: result[0]?.totalStudents || 0
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        if (error instanceof Error) {
            throw new Error(`Error fetching data for tutorId ${tutorId}: ${error.message}`);
        }
        throw error;
    }
}



async tutorPieGraph(tutorId: string) {
    console.log('Reached userRepository with tutorId:', tutorId);

    try {
        const results = await Tutor.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(tutorId) }, // Match the specified tutorId
            },
            {
                $project: {
                    courses: {
                        $map: {
                            input: "$courses", // Loop over each course
                            as: "course",
                            in: {
                                courseId: "$$course.courseId", // Extract courseId
                                totalStudents: {
                                    $size: { $ifNull: ["$$course.students", []] } // Use $ifNull to default to an empty array
                                }
                            }
                        }
                    }
                }
            }
        ]);

        if (!results || results.length === 0) {
            console.warn("No data found for tutorId:", tutorId);
            return [];
        }

        console.log("Total students per course:", results[0].courses);
        return results[0].courses; // Return the array of courses with total students
    } catch (error) {
        console.error("Error fetching data:", error);
        if (error instanceof Error) {
            throw new Error(`Error fetching data for tutorId ${tutorId}: ${error.message}`);
        }
        throw error;
    }
}



async adminPayout(data:TutorWithDynamicProperties) {
    console.log('Reached userRepository with tutorId array:', data);
    try {
        // Map over each item in data array and add tutor name
        const addedData = await Promise.all(data.map(async (item:any) => {
            // Fetch tutor document from the database using tutorId
            const tutor = await Tutor.findOne({ _id: item.tutorId });

            // Check if tutor exists and add tutorName to the item, or set to "Unknown" if not found
            if (tutor) {
                item.tutorName = tutor.tutorname;
            } else {
                item.tutorName = "Unknown";
            }

            // Return the updated item with tutorName
            return item;
        }));

        return addedData;
    } catch (error) {
        console.error("Error fetching data:", error);
        if (error instanceof Error) {
            throw new Error(`Error fetching data for tutorId : ${error.message}`);
        }
        throw error;
    }
}



async  addInformation(data: TutorAdditionalInfoPayload): Promise<ITutor | null> {
    try {
      const { id: id, profilePicture, bio, cv, expertise, qualifications } = data;
  
      // Update the Tutor document with new data based on _id
      const updatedTutor = await Tutor.findByIdAndUpdate(
        id,
        {
          profile_picture: profilePicture,
          bio,
          cv,
          expertise,
          qualifications,
        },
        { new: true, runValidators: true, upsert: false }
      );
  
      if (!updatedTutor) {
        throw new Error("Tutor not found");
      }
  
      return updatedTutor;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Error updating tutor information: ${err.message}`);
    }
  }



  async  fetchProfile(data: tutorId): Promise<ITutor | null> {
    try {
        const {tutorId} = data
        const tutor = await Tutor.findOne({_id:tutorId}).select('-password').exec()
        return tutor
    } catch (error) {
      const err = error as Error;
      throw new Error(`Error updating tutor information: ${err.message}`);
    }
  }


  async tutorMyCourse(data: { userId: string }): Promise<any> {
    try {
      const { userId } = data;
  
      const tutor = await Tutor.findOne({ _id: userId }, { "courses.courseId": 1 });
  
      if (!tutor) {
        return null;    
      }
  
      const courseIds = tutor.courses?.map((course) => course.courseId.toString()) || [];
  
      return courseIds;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Error fetching tutor courses: ${err.message}`);
    }
  }
  
  


  async fetchTutor(data:FetchTutorRequest): Promise<FetchTutorResponse> {
    try {
      const {courseId} = data
      const tutor = await Tutor.findOne({
        courses: {
          $elemMatch: { courseId: courseId }, // Check if courseId exists in courses array
        },
      }).select('_id tutorname profile_picture expertise'); // Select only the required fields
  
      if (!tutor) {
        return {
          tutors: [
            {
              name: 'Unknown Tutor', // Default name
              profile_picture: '', // Default profile picture (empty string)
              expertise: 'No expertise available', // Default expertise message
            },
          ],
        };
      }
  
      const profilePicture = tutor.profile_picture || '';
      const expertise = Array.isArray(tutor.expertise)
        ? tutor.expertise.join(', ')
        : 'N/A';

        return {
            tutors: [
              {
                name: tutor.tutorname || 'Unknown', // Handle missing name gracefully
                profile_picture: profilePicture,
                expertise: expertise,
              },
            ],
          };
    } catch (error) {
      const err = error as Error;
      throw new Error(`Error fetching tutor by course ID: ${err.message}`);
    }
  }
  


}






