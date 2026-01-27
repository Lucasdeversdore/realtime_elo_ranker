import { MessageEvent } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { Observable } from 'rxjs';
export declare class RankingController {
    private readonly rankingService;
    constructor(rankingService: RankingService);
    getRanking(): Promise<import("../players/entities/player.entity").Player[]>;
    sendRankingEvents(): Observable<MessageEvent>;
}
