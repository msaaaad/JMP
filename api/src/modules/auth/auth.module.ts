import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import * as fs from 'fs';
import * as path from 'path';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './auth.entity';
import { JudicialOfficer } from '../judicial-officers/judicial-officer.entity';

const privateKey = fs.readFileSync(path.resolve(process.cwd(), 'keys/private.key'));
@Module({
  imports: [
    JwtModule.register({
      secret: privateKey,
      signOptions: { algorithm: 'RS256', expiresIn: '5m' }
    }),
    TypeOrmModule.forFeature([Auth, JudicialOfficer])
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
