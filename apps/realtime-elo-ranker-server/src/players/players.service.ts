import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(name: string): Promise<Player> {
    if (!name || name.trim().length === 0) {
      throw new BadRequestException("Le nom du joueur ne peut pas être vide.");
    }

    const cleanName = name.trim();

    const existingPlayer = await this.findById(cleanName);
    if (existingPlayer) {
      throw new ConflictException(`Le joueur "${cleanName}" existe déjà dans le classement.`);
    }

    const initialRank = await this.calculateAverageRank();
    
    const newPlayer = this.playerRepository.create({
      id: cleanName,
      name: cleanName,
      rank: initialRank,
    });
    
    const savedPlayer = await this.playerRepository.save(newPlayer);

    this.eventEmitter.emit('ranking.updated', {
      updatedPlayers: [savedPlayer],
    });

    return savedPlayer;
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