import { IsString } from 'class-validator';

export class RequestTokenDto {
  @IsString()
  serviceId: string;

  @IsString()
  dateOfBirth: string;
}
