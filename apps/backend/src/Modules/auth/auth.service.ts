import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthCredentialsDto } from '../../DTO/auth.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Auth } from '../../Schema/auth.schema';
import { ObjectId } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectModel(Auth.name) private authModel: Model<Auth>,
    private configService: ConfigService,
  ) {}

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  private async checkUserExists(email: string): Promise<Auth | null> {
    try {
      return await this.authModel.findOne({ email });
    } catch (error) {
      this.logger.error(
        `Failed to check if user exists with email: ${email}`,
        error.stack,
      );
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  private async generateJwtToken(
    id: string | ObjectId,
    email: string,
  ): Promise<string> {
    const payload = { id, email };
    try {
      return jwt.sign(payload, this.configService.get<string>('SECRET_KEY'), {
        expiresIn: '1h',
      });
    } catch (error) {
      this.logger.error(
        `Failed to generate JWT token for user: ${email}`,
        error.stack,
      );
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async signup(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ token: string }> {
    try {
      const { email, password } = authCredentialsDto;
      this.logger.log(`Attempting to sign up user with email: ${email}`);

      const existingUser = await this.checkUserExists(email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const salt = await bcrypt.genSalt(); // Unique salt for the user
      const hashedPassword = await this.hashPassword(password, salt);

      const newUser = new this.authModel({
        email,
        password: hashedPassword,
        salt,
      });

      await newUser.save();

      const token = await this.generateJwtToken(newUser._id, newUser.email);
      this.logger.log(`User signed up successfully: ${email}`);
      return { token };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Failed to signup user`, error.stack);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async login(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ token: string }> {
    try {
      const { email, password } = authCredentialsDto;
      this.logger.log(`Attempting to log in user with email: ${email}`);
      const user = await this.checkUserExists(email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const hashedPassword = await this.hashPassword(password, user.salt);

      if (hashedPassword !== user.password) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = await this.generateJwtToken(user._id, user.email);
      this.logger.log(`User logged in successfully: ${email}`);
      return { token };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(`Failed to login user`, error.stack);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
