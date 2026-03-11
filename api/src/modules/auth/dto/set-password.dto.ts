import { IsString } from 'class-validator';

export class SetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  password: string;
}