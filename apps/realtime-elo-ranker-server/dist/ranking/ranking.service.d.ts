import { PlayersService } from '../players/players.service';
import { Player } from 'src/players/entities/player.entity';
export declare class RankingService {
    private readonly playersService;
    constructor(playersService: PlayersService);
    getRanking(): Promise<Player[]>;
}
