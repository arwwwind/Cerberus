import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto {
  @ApiProperty({ example: 'success' })
  statusCode: string;

  @ApiProperty({ example: 'Success message' })
  message: string;

  @ApiProperty({ example: '32F0B273D8BA7BEE36E03FBCDE7D4273C7BED1BCF457DC836C9C60BDB2B74404' })
  data: string;
}
