import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '../../common/decorator/auth.decorator';
import { CurrentUser } from '../../common/decorator/current-user.decorator';
import { MongoIdPipe } from '../../common/pipe/mongo-id.pipe';
import { ZodValidationPipe } from '../../common/pipe/zod-validation.pipe';
import { ClassValidatorPipe } from '../../common/pipe/class-validator.pipe';
import { UserDocument } from '../../DB/model/user.model';
import { RoleEnum } from '../../common/enum/user.enum';

import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import {
  forgotPasswordZodSchema,
  loginZodSchema,
  refreshTokenZodSchema,
  resetPasswordZodSchema,
  signUpZodSchema,
  ForgotPasswordZodDto,
  LoginZodDto,
  RefreshTokenZodDto,
  ResetPasswordZodDto,
  SignUpZodDto,
} from './dto/auth.zod';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body(new ZodValidationPipe(signUpZodSchema)) body: SignUpZodDto) {
    return this.userService.signUp(body);
  }

  
  @Post('sign-up/manual')
  @HttpCode(HttpStatus.CREATED)
  signUpManual(@Body(new ClassValidatorPipe()) body: CreateUserDto) {
    return this.userService.signUp(body);
  }

  
  @Get('confirm-email')
  confirmEmail(@Query('token') token: string) {
    return this.userService.confirmEmail(token);
  }

  
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body(new ZodValidationPipe(loginZodSchema)) body: LoginZodDto) {
    return this.userService.login(body);
  }

  
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Body(new ZodValidationPipe(refreshTokenZodSchema)) body: RefreshTokenZodDto) {
    return this.userService.refresh(body.refreshToken);
  }

  
  @Post('logout')
  @Auth()
  @HttpCode(HttpStatus.OK)
  logout(@CurrentUser('_id') userId: string) {
    return this.userService.logout(userId.toString());
  }

  
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(
    @Body(new ZodValidationPipe(forgotPasswordZodSchema)) body: ForgotPasswordZodDto,
  ) {
    return this.userService.forgotPassword(body.email);
  }

  
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body(new ZodValidationPipe(resetPasswordZodSchema)) body: ResetPasswordZodDto) {
    return this.userService.resetPassword(body.token, body.newPassword);
  }

  
  @Get('profile')
  @Auth()
  getProfile(@CurrentUser() user: UserDocument) {
    return user;
  }

  
  @Get(':id')
  @Auth(RoleEnum.ADMIN)
  findById(@Param('id', MongoIdPipe) id: string) {
    return this.userService.findById(id);
  }

  
  @Patch('profile')
  @Auth()
  updateProfile(@CurrentUser('_id') userId: string, @Body() body: UpdateUserDto) {
    return this.userService.updateProfile(userId.toString(), body);
  }
}
