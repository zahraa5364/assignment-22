import { z } from 'zod';
import { GenderEnum } from '../../../common/enum/user.enum';


export const signUpZodSchema = z
  .object({
    firstName: z.string().trim().min(2, 'firstName must be at least 2 characters').max(50),
    lastName: z.string().trim().min(2, 'lastName must be at least 2 characters').max(50),
    email: z.string().trim().toLowerCase().email('email must be a valid email address'),
    password: z
      .string()
      .min(8, 'password must be at least 8 characters')
      .regex(/[A-Z]/, 'password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'password must contain at least one number'),
    confirmPassword: z.string(),
    gender: z.nativeEnum(GenderEnum).optional(),
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    message: 'password and confirmPassword do not match',
    path: ['confirmPassword'],
  });

export type SignUpZodDto = z.infer<typeof signUpZodSchema>;


export const loginZodSchema = z
  .object({
    email: z.string().trim().toLowerCase().email('email must be a valid email address'),
    password: z.string().min(1, 'password is required'),
  })
  .strict();

export type LoginZodDto = z.infer<typeof loginZodSchema>;


export const forgotPasswordZodSchema = z
  .object({
    email: z.string().trim().toLowerCase().email('email must be a valid email address'),
  })
  .strict();

export type ForgotPasswordZodDto = z.infer<typeof forgotPasswordZodSchema>;


export const resetPasswordZodSchema = z
  .object({
    token: z.string().min(1, 'token is required'),
    newPassword: z
      .string()
      .min(8, 'newPassword must be at least 8 characters')
      .regex(/[A-Z]/, 'newPassword must contain at least one uppercase letter')
      .regex(/[a-z]/, 'newPassword must contain at least one lowercase letter')
      .regex(/[0-9]/, 'newPassword must contain at least one number'),
    confirmNewPassword: z.string(),
  })
  .strict()
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'newPassword and confirmNewPassword do not match',
    path: ['confirmNewPassword'],
  });

export type ResetPasswordZodDto = z.infer<typeof resetPasswordZodSchema>;


export const refreshTokenZodSchema = z
  .object({
    refreshToken: z.string().min(1, 'refreshToken is required'),
  })
  .strict();

export type RefreshTokenZodDto = z.infer<typeof refreshTokenZodSchema>;
