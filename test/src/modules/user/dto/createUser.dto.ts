import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { GenderEnum } from '../../../common/enum/user.enum';
import { Match } from '../../../common/decorator/match.decorator';


export class CreateUserDto {
  @IsString({ message: 'firstName must be a string' })
  @MinLength(2, { message: 'firstName must be at least 2 characters' })
  @MaxLength(50, { message: 'firstName must be at most 50 characters' })
  firstName: string;

  @IsString({ message: 'lastName must be a string' })
  @MinLength(2, { message: 'lastName must be at least 2 characters' })
  @MaxLength(50, { message: 'lastName must be at most 50 characters' })
  lastName: string;

  @IsEmail({}, { message: 'email must be a valid email address' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'password must be at least 8 characters' })
  @Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/, {
    message: 'password must contain uppercase, lowercase and a number',
  })
  password: string;

  @IsString()
  @Match('password', { message: 'confirmPassword must match password' })
  confirmPassword: string;

  @IsOptional()
  @IsEnum(GenderEnum, { message: 'gender must be one of: male, female' })
  gender?: GenderEnum;
}
