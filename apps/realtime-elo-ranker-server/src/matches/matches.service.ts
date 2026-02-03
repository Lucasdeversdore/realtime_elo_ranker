import { Injectable, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { PlayersService } from '../players/players.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class MatchesService {
  
  async findAll(): Promise<Match[]> {
    return await this.matchRepository.find({
      order: { createdAt: 'DESC' }, // Les plus récents en premier
      take: 20, // On limite aux 20 derniers matchs
    });
  }
  private readonly K = 32;
  private readonly logger = new Logger(MatchesService.name);

  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    private readonly playersService: PlayersService,
    private eventEmitter: EventEmitter2,
  ) {}

  async processMatchWithWinner(winnerId: string, loserId: string, isDraw: boolean) {
    try {
      const winner = await this.playersService.findById(winnerId);
      const loser = await this.playersService.findById(loserId);

      if (!winner || !loser) {
        this.logger.warn(`Joueurs introuvables: Winner=${winnerId}, Loser=${loserId}`);
        throw new BadRequestException('Un des joueurs n’existe pas en base de données.');
      }

      const rankW = winner.rank;
      const rankL = loser.rank;

      const weW = 1 / (1 + Math.pow(10, (rankL - rankW) / 400));
      const scoreW = isDraw ? 0.5 : 1;
      const scoreL = isDraw ? 0.5 : 0;

      const newRankW = Math.round(rankW + this.K * (scoreW - weW));
      const newRankL = Math.round(rankL + this.K * (scoreL - (1 - weW)));

      await this.playersService.updateElo(winner.id, newRankW);
      await this.playersService.updateElo(loser.id, newRankL);

      const matchEntry = await this.matchRepository.save(
        this.matchRepository.create({
          playerAId: winner.id,
          playerBId: loser.id,
          result: isDraw ? 'DRAW' : 'WINNER_A',
          oldRankA: rankW,
          newRankA: newRankW,
          oldRankB: rankL,
          newRankB: newRankL,
        })
      );

      this.eventEmitter.emit('ranking.updated', {
        updatedPlayers: [
          { ...winner, rank: newRankW },
          { ...loser, rank: newRankL }
        ]
      });

      return matchEntry;

    } catch (error) {
      this.logger.error(`Erreur lors du match: ${error.message}`, error.stack);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Erreur interne lors de la validation du match');
    }
  }
}