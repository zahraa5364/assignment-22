import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AppConfigService } from '../../config/config.service';
import { EmailSubjectEnum } from '../../common/enum/email.enum';
import { EmailService } from '../../common/utils/email/email.service';
import { compareHash } from '../../common/utils/security/hash.security';
import { JwtService } from '../../common/token/jwt.service';
import { TokenService } from '../../common/token/token.service';
import { ITokenPair } from '../../common/token/token.interface';
import { UserRepository } from '../../DB/repository/user.repository';
import { UserDocument } from '../../DB/model/user.model';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { LoginZodDto, SignUpZodDto } from './dto/auth.zod';


@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly configService: AppConfigService,
  ) {}

  
  async signUp(dto: SignUpZodDto | CreateUserDto): Promise<{ message: string }> {
    const existing = await this.userRepository.existsByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    
    const user = await this.userRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: dto.password,
      gender: 'gender' in dto ? dto.gender : undefined,
    });

    
    await this.sendConfirmationEmail(user);

    return { message: 'Account created. Please check your email to confirm your account.' };
  }

  private async sendConfirmationEmail(user: UserDocument): Promise<void> {
    const token = this.jwtService.signConfirmEmailToken({
      sub: user._id.toString(),
      email: user.email,
    });

    const confirmUrl = `${this.configService.frontendUrl}/auth/confirm-email?token=${token}`;

    try {
      await this.emailService.sendEmail({
        to: user.email,
        subject: EmailSubjectEnum.CONFIRM_EMAIL,
        greetingName: user.firstName,
        message:
          'Thanks for signing up! Please confirm your email address to activate your account. This link expires soon.',
        actionUrl: confirmUrl,
        actionLabel: 'Confirm Email',
      });
    } catch (error) {
      
      this.logger.error(`Could not send confirmation email to ${user.email}`, error as Error);
    }
  }

  
  async confirmEmail(token: string): Promise<{ message: string }> {
    let payload;
    try {
      payload = this.jwtService.verifyConfirmEmailToken(token);
    } catch {
      throw new BadRequestException('Invalid or expired confirmation link');
    }

    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.confirmed) {
      return { message: 'Email already confirmed' };
    }

    await this.userRepository.updateById(user._id, { confirmed: true });

    return { message: 'Email confirmed successfully. You can now log in.' };
  }

  
  async login(dto: LoginZodDto): Promise<ITokenPair> {
    const user = await this.userRepository.findByEmail(dto.email, true);

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await compareHash(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.confirmed) {
      throw new UnauthorizedException('Please confirm your email before logging in');
    }

    if (user.freezed) {
      throw new UnauthorizedException('This account has been deactivated');
    }

    return this.tokenService.generateTokenPair({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    });
  }

  async refresh(refreshToken: string): Promise<ITokenPair> {
    return this.tokenService.refreshAccessToken(refreshToken);
  }

  async logout(userId: string): Promise<{ message: string }> {
    await this.tokenService.revokeRefreshToken(userId);
    return { message: 'Logged out successfully' };
  }

  
  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findByEmail(email);

   
    if (!user) {
      return { message: 'If that email exists, a reset link has been sent.' };
    }

    const token = this.jwtService.signResetPasswordToken({
      sub: user._id.toString(),
      email: user.email,
    });

    const resetUrl = `${this.configService.frontendUrl}/auth/reset-password?token=${token}`;

    try {
      await this.emailService.sendEmail({
        to: user.email,
        subject: EmailSubjectEnum.RESET_PASSWORD,
        greetingName: user.firstName,
        message:
          'We received a request to reset your password. Click the button below to choose a new one. If you did not request this, you can safely ignore this email.',
        actionUrl: resetUrl,
        actionLabel: 'Reset Password',
      });
    } catch (error) {
      this.logger.error(`Could not send reset-password email to ${user.email}`, error as Error);
    }

    return { message: 'If that email exists, a reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    let payload;
    try {
      payload = this.jwtService.verifyResetPasswordToken(token);
    } catch {
      throw new BadRequestException('Invalid or expired reset link');
    }

    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    
    user.password = newPassword;
    await user.save();

    
    await this.tokenService.revokeRefreshToken(user._id.toString());

    return { message: 'Password has been reset successfully. Please log in again.' };
  }

 
  async findById(id: string): Promise<UserDocument> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(id: string, dto: UpdateUserDto): Promise<UserDocument> {
    const user = await this.userRepository.updateById(id, dto);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async deactivate(id: string): Promise<{ message: string }> {
    const user = await this.userRepository.updateById(id, { freezed: true });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.tokenService.revokeRefreshToken(id);
    return { message: 'Account deactivated' };
  }
}
