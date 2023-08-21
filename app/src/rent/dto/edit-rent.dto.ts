import { IsNumber, IsDate, IsOptional, IsBoolean } from "class-validator"

export class EditRentDto{

    @IsDate()
    @IsOptional()
    rentalEndTime?: Date
    
    @IsNumber()
    @IsOptional()
    userId?: number

    @IsNumber()
    @IsOptional()
    scooterId?: number

    @IsBoolean()
    @IsOptional()
    statu?: boolean
}