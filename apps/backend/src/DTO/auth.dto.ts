import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/.*[A-Za-z]+.*/, { message: 'Password must contain at least 1 letter' })
  @Matches(/.*\d+.*/, { message: 'Password must contain at least 1 number' })
  @Matches(/.*[!@#$%^&*(),.?":{}|<>]+.*/, { message: 'Password must contain at least 1 special character' })
  password: string;
}
