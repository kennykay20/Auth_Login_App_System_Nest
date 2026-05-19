export class UpdateUserDto {
  id?: string;
  name?: string;
  email?: string;
  passwordHash?: string;
  role?: string;
  isVerified?: boolean;
  verificationToken?: string;
  verificationTokenExpiresAt?: Date;
}
