import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../modules/user/guard/jwt-auth.guard';
import { RoleEnum } from '../enum/user.enum';
import { RolesGuard } from '../../modules/user/guard/roles.guard';

export const ROLES_KEY = 'roles';


export function Auth(...roles: RoleEnum[]) {
  return applyDecorators(SetMetadata(ROLES_KEY, roles), UseGuards(JwtAuthGuard, RolesGuard));
}
