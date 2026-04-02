import { Controller, Get, Post, Body } from '@nestjs/common';
import { AgentService } from './agent.service';
import { CreateAgentRequestDto } from './dto/create-agent-request.dto';
import { ApproveRequestDto } from './dto/approve-request.dto';
import { AgentRequest } from './interfaces/agent.interface';
import { User } from '../../common/decorators/user.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('agent')
@ApiBearerAuth()
@Controller({
  path: 'agent',
  version: '1',
})
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post('request-action')
  @ApiOperation({ summary: 'Submit an AI agent action request' })
  @ApiResponse({ status: 201, description: 'Request stored or executed.' })
  async handleRequest(
    @Body() createAgentRequestDto: CreateAgentRequestDto,
    @User('sub') userId: string,
  ) {
    return await this.agentService.handleRequest(createAgentRequestDto, userId);
  }

  @Get('requests')
  @ApiOperation({ summary: 'Get all pending agent requests' })
  @ApiResponse({ status: 200, description: 'List of pending requests.' })
  getRequests(): AgentRequest[] {
    return this.agentService.getRequests();
  }

  @Post('approve')
  @ApiOperation({ summary: 'Approve or deny a pending request' })
  @ApiResponse({ status: 200, description: 'Decision processed.' })
  async approveRequest(@Body() approveRequestDto: ApproveRequestDto) {
    return await this.agentService.approveRequest(approveRequestDto);
  }
}
