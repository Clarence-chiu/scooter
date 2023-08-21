import { Controller, Get, Patch, Delete, UseGuards, HttpCode, HttpStatus, Body, BadRequestException, Param, ParseIntPipe } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtGuard } from "../auth/guard";
import { GetUser } from '../auth/decorator/';
import { ScooterService } from './scooter.service';
import { EditScooterDto} from './dto';

@UseGuards(JwtGuard)
@Controller('scooter')
export class ScooterController {
    constructor(private scooterService: ScooterService) { }

    @Get('create')
    createScooter() {
        return this.scooterService.createScooter();
    }

    @Get('getall')
    getScooter() {
        return this.scooterService.getScooterAll();
    }

    @Get('get/:id')
    getScooterById(@Param('id', ParseIntPipe) scooterId: number) {
        return this.scooterService.getScooterById(scooterId);
    }

    @Patch('update/:id')
    async editScooterById(@Param('id', ParseIntPipe) scooterId: number, @Body() dto: EditScooterDto) {
        if (!dto || Object.keys(dto).length === 0) {
            throw new BadRequestException('Invalid request data');
        }
        return this.scooterService.editScooterById(scooterId, dto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('delete/:id')
    async deleteScooterById(@Param('id', ParseIntPipe) scooterId: number) {
        // Implement your logic to delete the user's scooter
        return this.scooterService.deleteScooterById(scooterId);
    }
}
