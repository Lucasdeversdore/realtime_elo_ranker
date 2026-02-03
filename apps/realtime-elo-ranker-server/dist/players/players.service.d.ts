import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class PlayersService {
    private playerRepository;
    private eventEmitter;
    constructor(playerRepository: Repository<Player>, eventEmitter: EventEmitter2);
    create(name: string): Promise<Player>;
    findAll(): Promise<Player[]>;
    findById(id: string): Promise<Player | null>;
    updateElo(id: string, newRank: number): Promise<void>;
    private calculateAverageRank;
}
