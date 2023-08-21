import { Global, Module } from '@nestjs/common';
import { ScooterService } from './scooter.service';
import { ScooterController } from "./scooter.controller";

@Global()
@Module({
  controllers:[ScooterController],
  providers: [ScooterService],
  exports:[ScooterService]
})
export class ScooterModule {}
