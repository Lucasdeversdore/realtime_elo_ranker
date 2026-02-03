/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { PlayersService } from '../players/players.service';
import { MatchesService } from './matches.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class MatchmakingService {
  private readonly logger = new Logger(MatchmakingService.name);

  constructor(
    private readonly playersService: PlayersService,
    private readonly matchesService: MatchesService,
  ) {}

  // Cette fonction s'exécute automatiquement toutes les minutes
  @Cron(CronExpression.EVERY_MINUTE)
  async handleAutoMatch() {
    this.logger.log('Lancement du matchmaking automatique...');
    const players = await this.playersService.findAll();
    if (players.length < 2) {
      this.logger.warn('Pas assez de joueurs pour un match.');
      return;
    }

    // 1. Sélectionner un joueur au hasard
    const playerA = players[Math.floor(Math.random() * players.length)];

    // 2. Trouver les adversaires potentiels (triés par proximité d'Elo)
    const opponents = players
      .filter((p) => p.id !== playerA.id)
      .sort(
        (a, b) =>
          Math.abs(a.rank - playerA.rank) - Math.abs(b.rank - playerA.rank),
      );

    // On prend l'un des 3 plus proches pour garder un peu d'aléatoire
    const topOpponents = opponents.slice(0, 3);
    const playerB =
      topOpponents[Math.floor(Math.random() * topOpponents.length)];

    this.logger.log(`Match auto : ${playerA.name} vs ${playerB.name}`);

    // 3. Simuler le résultat (50% de chance pour chacun, 10% de nul)
    const random = Math.random();
    let winnerId = playerA.id;
    let loserId = playerB.id;
    let isDraw = false;

    if (random < 0.1) {
      isDraw = true;
    } else if (random > 0.55) {
      winnerId = playerB.id;
      loserId = playerA.id;
    }

    await this.matchesService.processMatchWithWinner(winnerId, loserId, isDraw);
  }
}
