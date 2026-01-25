import { Type } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateTerm{
    @IsString()
    @IsOptional()
    name?: string

    @IsNumber()
    @IsOptional()
    year?: number

    @IsString()
    @IsOptional()
    period?: string

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    startsAt?: Date

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    endsAt?: Date
}