import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApproveRequestDto {
  @ApiProperty({
    example: '123-uuid',
    description: 'The ID of the pending request',
  })
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @ApiProperty({
    enum: ['allow_once', 'allow_always', 'deny'],
    example: 'allow_once',
  })
  @IsEnum(['allow_once', 'allow_always', 'deny'])
  @IsNotEmpty()
  decision: 'allow_once' | 'allow_always' | 'deny';
}
