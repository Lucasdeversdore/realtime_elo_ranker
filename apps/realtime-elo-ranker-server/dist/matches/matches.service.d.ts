import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { PlayersService } from '../players/players.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class MatchesService {
    private readonly matchRepository;
    private readonly playersService;
    private eventEmitter;
    findAll(): Promise<Match[]>;
    private readonly K;
    private readonly logger;
    constructor(matchRepository: Repository<Match>, playersService: PlayersService, eventEmitter: EventEmitter2);
    processMatchWithWinner(winnerId: string, loserId: string, isDraw: boolean): Promise<Match>;
}
