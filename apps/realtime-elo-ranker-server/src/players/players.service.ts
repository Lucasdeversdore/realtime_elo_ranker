import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  async create(name: string): Promise<Player> {
    const initialRank = await this.calculateAverageRank();
    const newPlayer = this.playerRepository.create({
      id: name,
      name,
      rank: initialRank,
    });
    return this.playerRepository.save(newPlayer);
  }

  async findAll(): Promise<Player[]> {
    return this.playerRepository.find();
  }

  async findById(id: string): Promise<Player | null> {
    return this.playerRepository.findOneBy({ id });
  }

  async updateElo(id: string, newRank: number): Promise<void> {
    await this.playerRepository.update(id, { rank: newRank });
  }

  private async calculateAverageRank(): Promise<number> {
    const players = await this.findAll();
    if (players.length === 0) return 1200;
    const sum = players.reduce((acc, p) => acc + p.rank, 0);
    return Math.round(sum / players.length);
  }
}
