import { Controller, Post, Body, Get, Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MatchesService } from './matches.service';

@ApiTags('Matches')
@Controller('match')
export class MatchesController {
  private readonly logger = new Logger(MatchesController.name);

  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  @ApiOperation({ summary: 'Enregistrer un nouveau match' })
  @ApiResponse({ status: 201, description: 'Le match a été enregistré et le classement mis à jour.' })
  async createMatch(@Body() body: { winner: string; loser: string; draw: boolean }) {
    this.logger.log(`Match reçu : ${body.winner} vs ${body.loser}`);
    return await this.matchesService.processMatchWithWinner(
      body.winner, 
      body.loser, 
      body.draw
    );
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer l’historique des matchs' })
  async findAll() {
    return await this.matchesService.findAll();
  }
}