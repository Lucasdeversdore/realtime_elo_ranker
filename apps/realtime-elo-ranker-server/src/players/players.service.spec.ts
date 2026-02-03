import { Test, TestingModule } from '@nestjs/testing';
import { PlayersService } from './players.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConflictException } from '@nestjs/common';

describe('PlayersService', () => {
  let service: PlayersService;
  let repo: any;

  // Mock du Repository TypeORM
  const mockRepo = {
    findOneBy: jest.fn(),
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(player => Promise.resolve({ ...player, id: player.name })),
    find: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        { provide: getRepositoryToken(Player), useValue: mockRepo },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
      ],
    }).compile();

    service = module.get<PlayersService>(PlayersService);
    repo = module.get(getRepositoryToken(Player));
  });

  it('doit créer un joueur avec 1200 Elo si la base est vide', async () => {
    repo.findOneBy.mockResolvedValue(null); // Pas de doublon
    const result = await service.create('Zidane');
    expect(result.rank).toBe(1200);
    expect(repo.save).toHaveBeenCalled();
  });

  it('doit lever une erreur si le joueur existe déjà', async () => {
    repo.findOneBy.mockResolvedValue({ name: 'Zidane' }); // Doublon trouvé
    await expect(service.create('Zidane')).rejects.toThrow(ConflictException);
  });
});