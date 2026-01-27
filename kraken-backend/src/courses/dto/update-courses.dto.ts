import { IsOptional, IsString } from "class-validator";


export class UpdateCourses{
    @IsString()
    @IsOptional()
    code?: string

    @IsString()
    @IsOptional()
    name?: string
}