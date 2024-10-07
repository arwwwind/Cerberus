import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 'error' })
  statusCode: string;

  @ApiProperty({ example: 'Error description' })
  message: string;

  @ApiProperty({ example: {} })
  error: any;
}