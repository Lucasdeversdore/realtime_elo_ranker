import { Test, TestingModule } from '@nestjs/testing';
import { MatchesService } from './matches.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { PlayersService } from '../players/players.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BadRequestException } from '@nestjs/common';

describe('MatchesService', () => {
  let service: MatchesService;
  let playersService: PlayersService;

  const mockMatchRepo = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(match => Promise.resolve({ id: 1, ...match })),
  };

  const mockPlayersService = {
    findById: jest.fn(),
    updateElo: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchesService,
        { provide: getRepositoryToken(Match), useValue: mockMatchRepo },
        { provide: PlayersService, useValue: mockPlayersService },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
      ],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
    playersService = module.get<PlayersService>(PlayersService);
  });

  it('doit lever une erreur si un joueur est introuvable', async () => {
    mockPlayersService.findById.mockResolvedValue(null);
    await expect(service.processMatchWithWinner('A', 'B', false))
      .rejects.toThrow(BadRequestException);
  });

  it('doit calculer correctement l Elo (Gagnant vs Perdant de même niveau)', async () => {
    // Cas : 2 joueurs à 1200. Le gagnant doit prendre +16 points (K=32, proba 0.5)
    const p1 = { id: 'Zidane', name: 'Zidane', rank: 1200 };
    const p2 = { id: 'Henry', name: 'Henry', rank: 1200 };
    
    mockPlayersService.findById
      .mockResolvedValueOnce(p1)
      .mockResolvedValueOnce(p2);

    const result = await service.processMatchWithWinner('Zidane', 'Henry', false);

    expect(result.newRankA).toBe(1216);
    expect(result.newRankB).toBe(1184);
    expect(playersService.updateElo).toHaveBeenCalledTimes(2);
  });

  it('doit gérer les matchs nuls (Draw)', async () => {
    const p1 = { id: 'A', name: 'A', rank: 1200 };
    const p2 = { id: 'B', name: 'B', rank: 1200 };
    
    mockPlayersService.findById.mockResolvedValueOnce(p1).mockResolvedValueOnce(p2);

    const result = await service.processMatchWithWinner('A', 'B', true);

    expect(result.newRankA).toBe(1200); // Pas de changement si même niveau et nul
    expect(result.result).toBe('DRAW');
  });
});