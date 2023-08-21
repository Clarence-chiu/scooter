import { Injectable } from '@nestjs/common';
import { ScooterService } from "../scooter/scooter.service";

@Injectable()
export class RentalService {
    constructor(private scooterService: ScooterService){}

    async createFakeScooter(num: number):Promise<boolean>{
        try {
            for(let i=0;i<num;i++){
                await this.scooterService.createScooter();
            }
        } catch (error) {
            return false;
        }
        return true;
    }
}
