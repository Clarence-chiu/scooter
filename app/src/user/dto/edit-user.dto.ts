import { IsEmail, IsString, IsOptional, IsBoolean } from 'class-validator';

export class EditUserDto{
    @IsEmail()
    @IsOptional()
    email?: string

    @IsString()
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    hash?: string;

    @IsString()
    @IsOptional()
    firstName?: string

    @IsString()
    @IsOptional()
    lastName?: string

    @IsBoolean()
    @IsOptional()
    isRenting?: boolean
}