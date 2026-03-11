import { Module } from '@nestjs/common';
import { JudicialOfficersController } from './judicial-officers.controller';
import { JudicialOfficersService } from './judicial-officers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JudicialOfficer } from './judicial-officer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JudicialOfficer])],
  controllers: [JudicialOfficersController],
  providers: [JudicialOfficersService],
  exports: [JudicialOfficersService],
})
export class JudicialOfficersModule {}
