import { Type } from "class-transformer";
import { IsDate, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTerm{
    @IsString()
    name: string

    @IsNumber()
    year: number

    @IsString()
    period: string

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    startsAt?: Date

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    endsAt?: Date
}