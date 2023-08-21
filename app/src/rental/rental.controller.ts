import { Controller, ForbiddenException, Logger } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from "../auth/dto";
import { AuthService } from "../auth/auth.service";
import { UserService } from "../user/user.service";
import { RentService } from "../rent/rent.service";
import { ScooterService } from "../scooter/scooter.service";
import { RentalService } from "./rental.service";
import { User } from '@prisma/client';
import{ EditRentDto } from '../rent/dto'


@Controller('rental')
export class RentalController {
    constructor(private prisma: PrismaService, private rentalService:RentalService,
        private authService: AuthService, 
        private userService: UserService,
        private scooterService: ScooterService,
        private rentService: RentService){}

    private readonly logger = new Logger(RentalController.name);

    private _token: string = "";
    private _user: User;

    private identityInf: AuthDto = {
        email: 'test@gmail.com',
        password: '123456'
    }

    
    @Timeout('RentalProcess', 10000)
    async RentalProcess(){
        try {
            // Clear db first
            await this.prisma.cleanDb();

            // Create fake scooters
            const fake_scooter_num = 3;
            await this.rentalService.createFakeScooter(fake_scooter_num);

            // Step 1. Sign up
            this.logger.debug(`Step 1. sign up with identityInf:${this.identityInf}`);
            this._user =  await this.authService.signup(this.identityInf);
            this.logger.debug('Sign up successed.');

            // Step 2. Sign in
            this.logger.debug(`Step 2. sign in with identityInf:${this.identityInf}`);
            this._token = (await this.authService.signin(this.identityInf)).access_token;
            this.logger.debug('Sign in successed');

            // Step 3. Get all scooters
            this.logger.debug(`Step 3. Get all scooters`);
            const scooters = await this.scooterService.getScooterAll();
            this.logger.debug('Get all scooters successed.');

            // Step 4. Rental a scooter.
            this.logger.debug('Step 4. Rental a scooter');
            const rentId = (await this.rentService.create(this._user.id, scooters[0].id)).id;
            this.logger.debug('Rental scooter successed.');
            const scooter = await this.scooterService.editScooterById(scooters[0].id, {isRenting: true})
            this.logger.debug('Update scooter parp isRenting successed.');

            // Step 5. Try to rental another scooter
            this.logger.debug('Step 5. Try to rental another scooter.');
            try {
                await this.rentService.create(this._user.id, scooters[1].id, );
                this.logger.debug('Rental scooter successed.');
            } catch (error) {
                this.logger.debug(`Try to rental another scooter fail. error:${error}`);
            }

            // Step 6. Create a another user and try to rentel a same same scooter.
            this.logger.debug('Step 6. Create a another user and try to rentel a same same scooter');
            const temp_user:User = await this.authService.signup({email:"test2", password:"654321"})
            try {
                await this.rentService.create(temp_user.id, scooters[0].id, );
                this.logger.debug('Try to rentel a same same scooter successed.');
            } catch (error) {
                this.logger.debug('Try to rentel a same same scooter fail.');
            }

            // Step 7. Return scooter
            this.logger.debug('Step 7. Return scooter');
            const temp_editRentDto: EditRentDto = {
                rentalEndTime: new Date(),
                statu:false
            }
            try {
                await this.rentService.update(rentId, temp_editRentDto);
                this.logger.debug('Try to return scooter successed.');
            } catch (error) {
                this.logger.debug(`Try to return scooter fail. error msg:${error}`);
            }
        } catch (error) {
            throw error;
        }
    }
}
