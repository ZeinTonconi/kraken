import { IsString } from "class-validator";


export class CreateCourses{
    @IsString()
    code: string

    @IsString()
    name: string
}