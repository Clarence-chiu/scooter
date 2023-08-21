import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";
import { EditScooterDto, CreateScooterDto } from './dto';

@Injectable()
export class ScooterService {
    constructor(private prisma: PrismaService) {}

    async createScooter() {
        const dto:CreateScooterDto = {
            ...await this.generateRandomTaipeiCoordinates(),
        }
        try {
            const scooter = await this.prisma.scooter.create({
                data: {
                    ...dto,
                },
            });
            return scooter;
        } catch (error) {
            throw new BadRequestException('Failed to create scooter Error msg:' + error);
        }
    }

    async getScooterAll() {
        return await this.prisma.scooter.findMany({
            where:{
                isRenting: false,
            }
        });
    }

    getScooterById(scooterId:number){
        const scooter = this.prisma.scooter.findUnique({
            where:{
                id: scooterId,
            }
        });

        return scooter;
    }

    async editScooterById(scooterId: number, dto: EditScooterDto) {
        try {
            const scooter = await this.prisma.scooter.update({
                where: {
                    id: scooterId,
                },
                data: {
                    ...dto,
                },
            });
            return scooter;
        } catch (error) {
            throw new BadRequestException('Failed to update scooter');
        }
    }

    async deleteScooterById(scooterId: number) {
        await this.prisma.scooter.delete({
            where: {
                id: scooterId,
            },
        });
    }

    
    generateRandomTaipeiCoordinates(): { latitude: number; longitude: number } {
        // 台北市的經緯度範圍
        const minLatitude = 24.75;
        const maxLatitude = 25.15;
        const minLongitude = 121.45;
        const maxLongitude = 121.65;

        const randomLatitude = Math.random() * (maxLatitude - minLatitude) + minLatitude;
        const randomLongitude = Math.random() * (maxLongitude - minLongitude) + minLongitude;

        return {
            latitude: randomLatitude,
            longitude: randomLongitude,
        };
    }
}
