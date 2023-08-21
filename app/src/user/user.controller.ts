import { Controller, Get, Patch, Delete, UseGuards, HttpCode, HttpStatus, Body, BadRequestException} from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtGuard } from "../auth/guard";
import { GetUser } from '../auth/decorator/'
import { EditUserDto } from './dto/edit-user.dto'
import { UserService } from './user.service'


@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
    constructor(private userService: UserService){}
    
    @Get('get')
    getUser(@GetUser() user:User){
        return user;
    }
    
    @Patch('update')
    async editUser(@GetUser('id') userId: number, @Body() dto:EditUserDto){
        if (!dto || Object.keys(dto).length === 0) {
            throw new BadRequestException('Invalid request data');
        }
        return await this.userService.editUser(userId, dto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('delete')
    async deleteUser(@GetUser('id') userId: number){
        return await this.userService.deleteUser(userId);
    }
}
