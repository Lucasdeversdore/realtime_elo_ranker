import { Injectable } from '@nestjs/common';
import { PlayersService } from '../players/players.service';
import { Player } from 'src/players/entities/player.entity';

@Injectable()
export class RankingService {
  constructor(private readonly playersService: PlayersService) {}

  // Ajoute async et précise le type de retour Promise<Player[]>
  async getRanking(): Promise<Player[]> {
    const players = await this.playersService.findAll();
    // Tri par rank décroissant
    return players.sort((a, b) => b.rank - a.rank);
  }
}
