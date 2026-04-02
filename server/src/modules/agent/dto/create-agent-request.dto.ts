import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAgentRequestDto {
  @ApiProperty({ example: 'send_email', description: 'The action to perform' })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty({
    example: 'test@mail.com',
    description: 'The recipient/target',
  })
  @IsString()
  @IsNotEmpty()
  target: string;

  @ApiProperty({ example: 'Hello', description: 'The message content' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
