import { IsString, MinLength } from 'class-validator';


export class ConfirmEmailDto {
  @IsString()
  @MinLength(1, { message: 'token is required' })
  token: string;
}
