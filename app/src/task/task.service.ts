import { Injectable, Logger  } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from "../prisma/prisma.service";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService, private config: ConfigService) { }
    private readonly logger = new Logger(TasksService.name);

    @Cron('*/1 * * * *')
    async checkRentDiffOneMinTask() {
        const mode = 
        this.logger.debug('Check Rent when the current second is 60');

        const rents = await this.prisma.rent.findMany({
            where: {
                rentalStartTime: {
                    lte: new Date(),
                }, statu: true
            },
        });

        const now = new Date();
        let Diff:number;
        let Unit:string = '小時';
        for (const rent of rents) {
            const timeDiff = now.getTime() - rent.rentalStartTime.getTime();
            if( this.config.get('MODE') === "TEST"){
                Diff = Math.floor(timeDiff / (1000 * 60));
                Unit = '分鐘'
            }else{
                Diff = Math.floor(timeDiff / (1000 * 60 * 60));
                Unit = '小時';
            }

            if (Diff >= 1 && Diff % 1 === 0) {
                const msg = `使用者: ${rent.userId}, 提醒! 您租借的${rent.scooterId}號車, 超過一小時`;
                console.log(msg)
                this.logger.debug(msg);
            }
        }
    }
}
