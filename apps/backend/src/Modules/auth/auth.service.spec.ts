import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { Auth } from '../../Schema/auth.schema';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, ConflictException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let authModel: any;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(Auth.name),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authModel = module.get(getModelToken(Auth.name));
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('signup', () => {
    it('should create a new user', async () => {
      const authCredentialsDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(authModel, 'findOne').mockResolvedValue(null);
      jest.spyOn(authModel.prototype, 'save').mockResolvedValue({
        _id: '123',
        email: authCredentialsDto.email,
        password: 'hashedPassword',
        salt: 'salt',
      });
      jest.spyOn(authService, 'generateJwtToken').mockResolvedValue('token');

      const result = await authService.signup(authCredentialsDto);

      expect(authModel.findOne).toHaveBeenCalledWith({
        email: authCredentialsDto.email,
      });
      expect(authModel.prototype.save).toHaveBeenCalled();
      expect(authService.generateJwtToken).toHaveBeenCalledWith(
        '123',
        authCredentialsDto.email,
      );
      expect(result).toEqual({ token: 'token' });
    });

    it('should throw ConflictException if email already exists', async () => {
      const authCredentialsDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(authModel, 'findOne').mockResolvedValue({
        email: authCredentialsDto.email,
      });

      await expect(authService.signup(authCredentialsDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should log in a user', async () => {
      const authCredentialsDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = {
        email: authCredentialsDto.email,
        password: 'hashedPassword',
        salt: 'salt',
      };

      jest.spyOn(authModel, 'findOne').mockResolvedValue(user);
      jest.spyOn(authService, 'generateJwtToken').mockResolvedValue('token');

      const result = await authService.login(authCredentialsDto);

      expect(authModel.findOne).toHaveBeenCalledWith({
        email: authCredentialsDto.email,
      });
      expect(authService.generateJwtToken).toHaveBeenCalledWith(
        user._id,
        user.email,
      );
      expect(result).toEqual({ token: 'token' });
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      const authCredentialsDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(authModel, 'findOne').mockResolvedValue(null);

      await expect(authService.login(authCredentialsDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const authCredentialsDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = {
        email: authCredentialsDto.email,
        password: 'hashedPassword',
        salt: 'salt',
      };

      jest.spyOn(authModel, 'findOne').mockResolvedValue(user);
      jest
        .spyOn(authService, 'hashPassword')
        .mockResolvedValue('invalidPassword');

      await expect(authService.login(authCredentialsDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
