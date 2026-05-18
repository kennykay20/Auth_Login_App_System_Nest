export class UserDetailsDto {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  isVerified: boolean;
  verificationToken?: string | null;
  verificationTokenExpiresAt?: Date | null;
  resetToken?: string | null;
  resetTokenExpiresAt?: Date | null;
  refreshTokenHash?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
