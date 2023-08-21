import { Controller, Get, UseGuards, Body, BadRequestException, 
    Patch, Delete, Param, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import { RentService } from './rent.service';
import { EditRentDto } from './dto';
import { GetUser } from '../auth/decorator/'
import { JwtGuard } from "../auth/guard";

@UseGuards(JwtGuard)
@Controller('rent')
export class RentController {
    constructor(private rentService: RentService) { }
    
    @Get('get')
    async getByUserId(@GetUser('id') userId: number) {
        return this.rentService.getAllByUser(userId);
    }

    @Get('get/:id')
    async get(@Param('id', ParseIntPipe) rentId: number) {
        if (!rentId) {
            throw new BadRequestException('rentId parameter is required.');
        }
        return this.rentService.get(rentId);
    }

    @Get('create/:id')
    async rent(@GetUser('id') userId: number, @Param('id', ParseIntPipe) scooterId: number) {
        if (!scooterId) {
            throw new BadRequestException('rentId parameter is required.');
        }
        
        return this.rentService.create(userId, scooterId);
    }

    @Patch('update/:id')
    async update(@Param('id', ParseIntPipe) rentId: number, @Body() dto:EditRentDto) {
        if (!rentId) {
            throw new BadRequestException('rentId parameter is required.');
        }
        if(!dto || Object.keys(dto).length === 0){
            throw new BadRequestException('Invalid request data');
        }

        const rent = await this.rentService.get(rentId);
        if(!rent){
            throw new ForbiddenException('This action is not allowed.');
        }
        return this.rentService.update(rentId, dto);
    }

    @Patch('return/:id')
    async return(@Param('id', ParseIntPipe) rentId: number) {
        if (!rentId) {
            throw new BadRequestException('rentId parameter is required.');
        }

        const rent = await this.rentService.get(rentId);
        if(!rent){
            throw new ForbiddenException('This action is not allowed.');
        }
        
        const dto: EditRentDto = {
            rentalEndTime: new Date(),
            statu: false,
        }
        return this.rentService.update(rentId, dto);
    }

    @Delete('delete/:id')
    async delete(@Param('id', ParseIntPipe) rentId: number) {
        if (!rentId) {
            throw new BadRequestException('rentId parameter is required.');
        }
        return this.rentService.delete(rentId);
    }
}
