import { PlayersService } from '../players/players.service';
export declare class RankingService {
    private readonly playersService;
    constructor(playersService: PlayersService);
    getRanking(): Promise<import("../players/entities/player.entity").Player[]>;
}
