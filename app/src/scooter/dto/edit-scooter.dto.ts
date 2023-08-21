import { IsOptional, IsBoolean, IsNumber,IsNotEmpty } from 'class-validator';

export class EditScooterDto{
    @IsNumber()
    @IsOptional()
    latitude?: number;

    @IsNumber()
    @IsOptional()
    longitude?: number;

    @IsBoolean()
    @IsOptional()
    isRenting?: boolean
}