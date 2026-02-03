/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { MatchesService } from '../src/matches/matches.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Match } from '../src/matches/entities/match.entity';
import { PlayersService } from '../src/players/players.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

describe('MatchesService', () => {
  let service: MatchesService;
  let playersService: PlayersService;
  let matchRepo: Repository<Match>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchesService,
        {
          provide: getRepositoryToken(Match),
          useValue: {
            create: jest.fn((d) => d),
            save: jest.fn((m) => m),
          },
        },
        {
          provide: PlayersService,
          useValue: { findById: jest.fn(), updateElo: jest.fn() },
        },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
      ],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
    playersService = module.get<PlayersService>(PlayersService);
    matchRepo = module.get<Repository<Match>>(getRepositoryToken(Match));
  });

  it('doit lever une erreur si un joueur est introuvable', async () => {
    (playersService.findById as jest.Mock).mockResolvedValue(null);
    await expect(
      service.processMatchWithWinner('A', 'B', false),
    ).rejects.toThrow(BadRequestException);
  });

  it('doit calculer correctement l Elo pour un match nul déséquilibré', async () => {
    const p1 = { id: 'Fort', rank: 2000 };
    const p2 = { id: 'Faible', rank: 1000 };
    (playersService.findById as jest.Mock)
      .mockResolvedValueOnce(p1)
      .mockResolvedValueOnce(p2);

    const result = await service.processMatchWithWinner('Fort', 'Faible', true);

    expect(result.newRankA).toBeLessThan(2000);
    expect(result.newRankB).toBeGreaterThan(1000);
  });

  it('doit lever une InternalServerErrorException si la sauvegarde échoue', async () => {
    (playersService.findById as jest.Mock).mockResolvedValue({
      id: 'A',
      rank: 1200,
    });
    jest.spyOn(matchRepo, 'save').mockRejectedValue(new Error('Crash DB'));

    await expect(
      service.processMatchWithWinner('A', 'B', false),
    ).rejects.toThrow(InternalServerErrorException);
  });
});
