import { Controller, Get, Sse, MessageEvent } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { interval, map, Observable, switchMap } from 'rxjs';
import { from } from 'rxjs'; // Ajoute cet import

@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get()
  async getRanking() {
    // On attend le résultat avant de le renvoyer
    return await this.rankingService.getRanking();
  }

  @Sse('events')
  sendRankingEvents(): Observable<MessageEvent> {
    return interval(2000).pipe(
      // switchMap permet d'attendre la Promise de getRanking à chaque intervalle
      switchMap(() => from(this.rankingService.getRanking())),
      map(
        (ranking) =>
          ({
            data: {
              type: 'RankingUpdate',
              player: ranking[0],
            },
          }) as MessageEvent,
      ),
    );
  }
}
