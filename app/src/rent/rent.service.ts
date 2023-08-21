import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";
import { EditRentDto } from './dto';

@Injectable()
export class RentService {
    constructor(private prisma: PrismaService) {}

    async getAllByUser(userId: number){
        return await this.prisma.rent.findMany({
            where:{
                userId,
            }
        });
    }

    async get(rentId: number){
        return await this.prisma.rent.findUnique({
            where:{
                id:rentId
            }
        });
    }

    async create(userId: number, scooterId: number) {
        // * 一次只能同時租借一台Scooter
        const rent = await this.getAllByUser(userId);
        if(rent.length > 0){
            throw new ForbiddenException('This action is not allowed.');
        }
        // *scooter 已經借出，不可再借
        const scooter = await this.prisma.scooter.findUnique({
            where:{
                id: scooterId,
            }
        });
        if (!scooter || scooter.isRenting == true) {
            throw new ForbiddenException('This action is not allowed.');
        }
        try {
            const rent = await this.prisma.rent.create({
                data: {
                    userId: userId,
                    scooterId: scooterId,
                },
            });
            return rent;
        } catch (error) {
            throw new BadRequestException('Failed to create rent');
        }
    }

    async update(rentId: number, dto: EditRentDto) {
        try {
            const rent = await this.prisma.rent.update({
                where: {
                    id: rentId,
                },
                data: {
                    ...dto,
                },
            });
            return rent;
        } catch (error) {
            throw new BadRequestException('Failed to update rent');
        }
    }

    async delete(rentId: number) {
        try {
            await this.prisma.rent.delete({
                where: {
                    id: rentId,
                },
            });
        } catch (error) {
            throw new BadRequestException('Failed to delete rent');
        }
    }
}
