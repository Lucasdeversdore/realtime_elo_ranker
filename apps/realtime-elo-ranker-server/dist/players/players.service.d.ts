import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
export declare class PlayersService {
    private playerRepository;
    constructor(playerRepository: Repository<Player>);
    create(name: string): Promise<Player>;
    findAll(): Promise<Player[]>;
    findById(id: string): Promise<Player | null>;
    updateElo(id: string, newRank: number): Promise<void>;
    private calculateAverageRank;
}
