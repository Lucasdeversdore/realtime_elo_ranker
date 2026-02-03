/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { PlayersService } from './players.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('PlayersService', () => {
  let service: PlayersService;
  let repo: Repository<Player>;

  // Mock du Repository typé pour éviter les "Unsafe call/assignment"
  const mockRepo = {
    findOneBy: jest.fn(),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((player) =>
      Promise.resolve({
        ...player,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        id: player.name,
      }),
    ),
    find: jest.fn(),
    update: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        {
          provide: getRepositoryToken(Player),
          useValue: mockRepo,
        },
        {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          provide: EventEmitter2,
          useValue: { emit: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<PlayersService>(PlayersService);
    repo = module.get<Repository<Player>>(getRepositoryToken(Player));
  });

  it('doit lever une erreur si le nom est vide ou composé d espaces', async () => {
    await expect(service.create('')).rejects.toThrow(BadRequestException);
    await expect(service.create('   ')).rejects.toThrow(BadRequestException);
  });

  it('doit créer un joueur avec 1200 Elo si la base est vide', async () => {
    (repo.findOneBy as jest.Mock).mockResolvedValue(null);
    (repo.find as jest.Mock).mockResolvedValue([]);
    const result = await service.create('Zidane');
    expect(result.rank).toBe(1200);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.save).toHaveBeenCalled();
  });

  it('doit créer un joueur avec la moyenne Elo des joueurs existants', async () => {
    (repo.findOneBy as jest.Mock).mockResolvedValue(null);
    // eslint-disable-next-line prettier/prettier
    (repo.find as jest.Mock).mockResolvedValue([{ rank: 1400 }, { rank: 1600 }]);
    const result = await service.create('Zidane');
    expect(result.rank).toBe(1500);
  });

  it('doit lever une ConflictException si le joueur existe déjà', async () => {
    (repo.findOneBy as jest.Mock).mockResolvedValue({ name: 'Zidane' });
    await expect(service.create('Zidane')).rejects.toThrow(ConflictException);
  });

  it('doit mettre à jour l Elo correctement', async () => {
    await service.updateElo('Zidane', 1300);
    expect(repo.update).toHaveBeenCalledWith('Zidane', { rank: 1300 });
  });
});
