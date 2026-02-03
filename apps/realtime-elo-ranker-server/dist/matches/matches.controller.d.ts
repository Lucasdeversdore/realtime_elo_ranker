import { MatchesService } from './matches.service';
export declare class MatchesController {
    private readonly matchesService;
    private readonly logger;
    constructor(matchesService: MatchesService);
    createMatch(body: {
        winner: string;
        loser: string;
        draw: boolean;
    }): Promise<import("./entities/match.entity").Match>;
    findAll(): Promise<import("./entities/match.entity").Match[]>;
}
