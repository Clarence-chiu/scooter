import { Injectable, HttpStatus, BadRequestException } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";
import { EditUserDto } from './dto/edit-user.dto'
import * as argon from 'argon2';

@Injectable()
export class UserService {
    constructor(private prisma:PrismaService) {}
    
    async editUser(userId: number, dto: EditUserDto){
        if (dto.password) {
            const hash = await argon.hash(dto.password);
            delete dto.password;
            dto.hash = hash;
        }
        try {
            const user = await this.prisma.user.update({
                where:{
                    id: userId,
                },
                data:{
                    ...dto,
                },
            });
            delete user.hash;
            return user;
        } catch (error) {
            throw new BadRequestException('Failed to update user');
        }
    }

    async deleteUser(userId:number){
        await this.prisma.user.delete({
            where:{
                id: userId,
            }
        });
    }
}
