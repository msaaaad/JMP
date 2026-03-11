import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
import { OfficerStatus } from "../enums/officer-status.enum";

export class CreateJudicialOfficerDto {
    @IsString()
    serviceId: string

    @IsString()
    fullName: string

    @IsOptional()
    @IsString()
    email?: string

    @IsOptional()
    @IsString()
    surname?: string

    @IsOptional()
    @IsString()
    education?: string

    @IsOptional()
    @IsString()
    phone?: string

    @IsDateString()
    dateOfBirth: string

    @IsOptional()
    @IsString()
    district?: string

    @IsOptional()
    @IsDateString()
    joiningDate?: string

    @IsOptional()
    @IsDateString()
    promotionDate?: string

    @IsOptional()
    @IsEnum(OfficerStatus)
    status?: OfficerStatus;
}