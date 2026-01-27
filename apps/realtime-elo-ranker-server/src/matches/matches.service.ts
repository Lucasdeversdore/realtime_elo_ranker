import { Injectable, BadRequestException } from '@nestjs/common';
import { PlayersService } from '../players/players.service';

// apps/realtime-elo-ranker-server/src/matches/matches.service.ts

@Injectable()
export class MatchesService {
  private readonly K = 32;

  constructor(private readonly playersService: PlayersService) {}

  // Ajoute "async" ici
  async processMatchWithWinner(
    winnerId: string,
    loserId: string,
    isDraw: boolean,
  ) {
    // Ajoute "await" devant les appels au service
    const winner = await this.playersService.findById(winnerId);
    const loser = await this.playersService.findById(loserId);

    if (!winner || !loser) {
      throw new BadRequestException(
        'Un ou plusieurs joueurs sont introuvables.',
      );
    }

    // Maintenant "winner" est un objet Player, on peut lire .rank
    const rankW = winner.rank;
    const rankL = loser.rank;

    const weW = 1 / (1 + Math.pow(10, (rankL - rankW) / 400));
    const scoreW = isDraw ? 0.5 : 1;
    const scoreL = isDraw ? 0.5 : 0;

    const newRankW = Math.round(rankW + this.K * (scoreW - weW));
    const newRankL = Math.round(rankL + this.K * (scoreL - (1 - weW)));

    // Ajoute "await" ici aussi car updateElo est devenu async
    await this.playersService.updateElo(winner.id, newRankW);
    await this.playersService.updateElo(loser.id, newRankL);

    return { winner: newRankW, loser: newRankL };
  }
}
