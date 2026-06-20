import { z } from 'zod';


const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),

  DB_URI: z.string().min(1, 'DB_URI is required'),

  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET is required'),
  JWT_ACCESS_EXPIRES_IN: z.string().min(1, 'JWT_ACCESS_EXPIRES_IN is required'),

  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
  JWT_REFRESH_EXPIRES_IN: z.string().min(1, 'JWT_REFRESH_EXPIRES_IN is required'),

  JWT_CONFIRM_EMAIL_SECRET: z.string().min(1, 'JWT_CONFIRM_EMAIL_SECRET is required'),
  JWT_CONFIRM_EMAIL_EXPIRES_IN: z.string().min(1, 'JWT_CONFIRM_EMAIL_EXPIRES_IN is required'),

  JWT_RESET_PASSWORD_SECRET: z.string().min(1, 'JWT_RESET_PASSWORD_SECRET is required'),
  JWT_RESET_PASSWORD_EXPIRES_IN: z.string().min(1, 'JWT_RESET_PASSWORD_EXPIRES_IN is required'),

  SALT_ROUNDS: z.coerce.number().default(10),

  REDIS_HOST: z.string().min(1, 'REDIS_HOST is required'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional().or(z.literal('')),

  EMAIL_HOST: z.string().min(1, 'EMAIL_HOST is required'),
  EMAIL_PORT: z.coerce.number().default(587),
  EMAIL_USER: z.string().min(1, 'EMAIL_USER is required'),
  EMAIL_PASSWORD: z.string().min(1, 'EMAIL_PASSWORD is required'),
  EMAIL_FROM: z.string().min(1, 'EMAIL_FROM is required'),

  FRONTEND_URL: z.string().min(1, 'FRONTEND_URL is required'),
});

export type EnvSchemaType = z.infer<typeof envSchema>;


export function validateEnv(config: Record<string, unknown>): EnvSchemaType {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    const formatted = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`❌ Invalid environment variables:\n${formatted}`);
  }

  return parsed.data;
}
