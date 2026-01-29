import { IsBoolean, IsOptional, IsUUID } from "class-validator";


export class GenerateJuniorRotationDto {

    @IsUUID()
    offeringId: string;

    @IsOptional()
    @IsBoolean()
    force?: boolean
}