import { PlayersService } from './players.service';
export declare class PlayersController {
    private readonly playersService;
    constructor(playersService: PlayersService);
    create(name: string): Promise<import("./entities/player.entity").Player>;
    findAll(): Promise<import("./entities/player.entity").Player[]>;
}
