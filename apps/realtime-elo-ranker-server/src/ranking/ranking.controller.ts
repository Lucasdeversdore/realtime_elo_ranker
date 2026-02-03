// apps/realtime-elo-ranker-server/src/ranking/ranking.controller.ts
import { Controller, Get, Sse, MessageEvent } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { RankingService } from './ranking.service';

@Controller('ranking')
export class RankingController {
  private readonly rankingStream$ = new Subject<any>();

  constructor(private readonly rankingService: RankingService) {}

  @Get()
  async getRanking() {
    return await this.rankingService.getRanking();
  }

  @Sse('events')
  sendRankingEvents(): Observable<MessageEvent> {
    return this.rankingStream$.asObservable().pipe(
      map((data) => ({ data } as MessageEvent)),
    );
  }

  @OnEvent('ranking.updated')
  handleRankingUpdate(payload: any) {
    // On envoie chaque joueur mis à jour dans le flux SSE pour le client
    payload.updatedPlayers.forEach((player: any) => {
      this.rankingStream$.next({
        type: 'RankingUpdate',
        player: player,
      });
    });
  }
}