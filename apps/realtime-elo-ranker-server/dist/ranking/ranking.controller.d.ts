import { MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RankingService } from './ranking.service';
export declare class RankingController {
    private readonly rankingService;
    private readonly rankingStream$;
    constructor(rankingService: RankingService);
    getRanking(): Promise<import("../players/entities/player.entity").Player[]>;
    sendRankingEvents(): Observable<MessageEvent>;
    handleRankingUpdate(payload: any): void;
}
