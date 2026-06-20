import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from '../../DB/model/user.model';


export const CurrentUser = createParamDecorator(
  (data: keyof UserDocument | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserDocument = request.user;

    return data ? user?.[data] : user;
  },
);
