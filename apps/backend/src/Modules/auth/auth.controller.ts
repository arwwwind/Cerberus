import { Controller, Post, Body, HttpCode, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from '../../DTO/auth.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../../DTO/error.dto';
import { SuccessResponseDto } from '../../DTO/success.dto';
import { JwtAuthGuard } from '../../Guards/auth.guard';

@Controller('auth') // Resource-based URL path
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @HttpCode(201) // 201 Created
  @ApiTags('Auth')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({
    status: 201,
    description: 'User signed up successfully',
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed',
    type: ErrorResponseDto,
  })
  async signup(@Body() authCredentialsDto: AuthCredentialsDto) {
    try {
      const token = await this.authService.signup(authCredentialsDto);
      return {
        statusCode: '201',
        message: 'Signup successful',
        data: token,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('/login')
  @HttpCode(200) // 200 OK
  @ApiTags('Auth')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    type: ErrorResponseDto,
  })
  async login(@Body() authCredentialsDto: AuthCredentialsDto) {
    try {
      const token = await this.authService.login(authCredentialsDto);
      return {
        statusCode: '200',
        message: 'Login successful',
        data: token,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('/validate')
  @HttpCode(200) // 200 OK
  @ApiTags('Auth')
  @ApiOperation({ summary: 'Validate Token' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    type: ErrorResponseDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async validateToken() {
    return 'Welcome';
  }
}
