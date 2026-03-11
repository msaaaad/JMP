import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  serviceId: string;

  @IsString()
  password: string;
}