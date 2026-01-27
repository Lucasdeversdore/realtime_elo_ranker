import { PlayersService } from '../players/players.service';
export declare class MatchesService {
    private readonly playersService;
    private readonly K;
    constructor(playersService: PlayersService);
    processMatchWithWinner(winnerId: string, loserId: string, isDraw: boolean): Promise<{
        winner: number;
        loser: number;
    }>;
}
