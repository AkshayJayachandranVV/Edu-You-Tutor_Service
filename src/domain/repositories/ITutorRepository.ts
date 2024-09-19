import {ITutor} from '../entities/ITutor'


export interface ITutorRepository{
    findByEmail(email:string):Promise<ITutor | null>;
}
