import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';


@Injectable()
export class ClassValidatorPipe implements PipeTransform<unknown> {
  async transform(value: unknown, metadata: ArgumentMetadata) {
    const { metatype } = metadata;

    if (!metatype || !this.shouldValidate(metatype)) {
      return value;
    }

    const instance = plainToInstance(metatype, value);
    const errors = await validate(instance as object, {
      whitelist: true, 
      forbidNonWhitelisted: true, 
      stopAtFirstError: false,
    });

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: this.flattenErrors(errors),
      });
    }

    return instance;
  }

  private shouldValidate(metatype: new (...args: unknown[]) => unknown): boolean {
    const primitiveTypes: unknown[] = [String, Boolean, Number, Array, Object];
    return !primitiveTypes.includes(metatype);
  }

  private flattenErrors(
    errors: ValidationError[],
  ): Array<{ field: string; messages: string[] }> {
    return errors.map((error) => ({
      field: error.property,
      messages: error.constraints ? Object.values(error.constraints) : ['Invalid value'],
    }));
  }
}
