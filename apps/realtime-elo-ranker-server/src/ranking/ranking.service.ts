import { Injectable } from '@nestjs/common';
import { PlayersService } from '../players/players.service';

@Injectable()
export class RankingService {
  constructor(private readonly playersService: PlayersService) {}

  async getRanking() {
    const players = await this.playersService.findAll();
    return players.sort((a, b) => b.rank - a.rank);
  }
}