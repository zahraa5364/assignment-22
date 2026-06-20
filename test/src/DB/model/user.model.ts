import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { GenderEnum, ProviderEnum, RoleEnum } from '../../common/enum/user.enum';
import { generateHash } from '../../common/utils/security/hash.security';

export type UserDocument = HydratedDocument<User>;


@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, trim: true, minlength: 2, maxlength: 50 })
  firstName: string;

  @Prop({ required: true, trim: true, minlength: 2, maxlength: 50 })
  lastName: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({
    required: function (this: User) {
      
      return this.provider === ProviderEnum.SYSTEM;
    },
    select: false,
  })
  password: string;

  @Prop({ enum: GenderEnum, default: GenderEnum.MALE })
  gender: GenderEnum;

  @Prop({ enum: RoleEnum, default: RoleEnum.USER })
  role: RoleEnum;

  @Prop({ enum: ProviderEnum, default: ProviderEnum.SYSTEM })
  provider: ProviderEnum;

  @Prop({ default: false })
  confirmed: boolean;

  @Prop({ default: false })
  freezed: boolean;

  
  password_confirmation?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);


UserSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    this.password = await generateHash(this.password);
  }
  next();
});

UserSchema.virtual('fullName').get(function (this: User) {
  return `${this.firstName} ${this.lastName}`;
});
