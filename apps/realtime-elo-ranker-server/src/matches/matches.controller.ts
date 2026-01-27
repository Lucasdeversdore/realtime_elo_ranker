import { Controller, Post, Body } from '@nestjs/common';
import { MatchesService } from './matches.service';

@Controller('match') // Vérifie bien que c'est 'match' sans S si ton client appelle /api/match
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  create(@Body() body: { winner: string; loser: string; draw: boolean }) {
    return this.matchesService.processMatchWithWinner(
      body.winner,
      body.loser,
      body.draw,
    );
  }
}
