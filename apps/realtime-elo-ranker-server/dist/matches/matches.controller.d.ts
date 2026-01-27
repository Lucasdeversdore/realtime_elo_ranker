import { MatchesService } from './matches.service';
export declare class MatchesController {
    private readonly matchesService;
    constructor(matchesService: MatchesService);
    create(body: {
        winner: string;
        loser: string;
        draw: boolean;
    }): Promise<{
        winner: number;
        loser: number;
    }>;
}
