import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule} from '@nestjs/serve-static';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { ScooterModule } from './scooter/scooter.module';
import { RentModule } from './rent/rent.module';
import { TasksService } from './task/task.service';
import { AppController } from './app.controller';
import { RentalModule } from './rental/rental.module';


@Module({
  imports: [ 
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/dist'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    PrismaModule,
    ScooterModule,
    RentModule,
    RentalModule,
  ],
  providers: [TasksService],
  controllers: [AppController],
})
export class AppModule {}
