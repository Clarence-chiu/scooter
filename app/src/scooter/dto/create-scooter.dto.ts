import { IsBoolean, IsNumber,IsNotEmpty } from 'class-validator';

export class CreateScooterDto{
    @IsNumber()
    @IsNotEmpty()
    latitude: number;

    @IsNumber()
    @IsNotEmpty()
    longitude: number;
}