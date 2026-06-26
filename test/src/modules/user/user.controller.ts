import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '../../common/decorator/auth.decorator';
import { CurrentUser } from '../../common/decorator/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDocument } from '../../DB/model/user.model';
import { RoleEnum } from '../../common/enum/user.enum';
import { signUpDto } from './dto/createUser.dto';
import { signInDto } from './dto/login.dto';
import { multerCloud, Store_Enum } from '../../common/utils/multer/multer.utils';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(@Req() req: any) {
    console.log({ user: req.user });
    return this.userService.getUsers()
  }

  @Post("signUp")
  signUp(@Body() body: signUpDto) {
    return this.userService.signUp(body)
  }

  @Post("signIn")
  signIn(@Body() body: signInDto) {
    return this.userService.signIn(body)
  }

  @Get("profile")
  @Auth({ roles: [RoleEnum.user] })
  getProfile(@CurrentUser() user: UserDocument) {
    return user
  }

  @Post("upload")
  @UseInterceptors(FileInterceptor("attachment", multerCloud({ store_type: Store_Enum.disk })))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return file
  }
}