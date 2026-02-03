import { Test, TestingModule } from '@nestjs/testing';
import { RankingService } from './ranking.service';
import { PlayersService } from '../players/players.service';

describe('RankingService', () => {
  let service: RankingService;
  let playersService: PlayersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RankingService,
        { provide: PlayersService, useValue: { findAll: jest.fn() } },
      ],
    }).compile();

    service = module.get<RankingService>(RankingService);
    playersService = module.get<PlayersService>(PlayersService);
  });

  it('doit retourner une liste vide si aucun joueur n est présent', async () => {
    (playersService.findAll as jest.Mock).mockResolvedValue([]);
    const result = await service.getRanking();
    expect(result).toEqual([]);
  });

  it('doit retourner les joueurs triés (A > B > C)', async () => {
    (playersService.findAll as jest.Mock).mockResolvedValue([
      { name: 'B', rank: 1200 },
      { name: 'A', rank: 1500 },
      { name: 'C', rank: 1000 },
    ]);
    const result = await service.getRanking();
    expect(result[0].name).toBe('A');
    expect(result[2].name).toBe('C');
  });
});
