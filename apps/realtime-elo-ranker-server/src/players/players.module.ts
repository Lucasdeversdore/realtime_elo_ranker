import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importe ceci
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { Player } from './entities/player.entity'; // Importe ton entité

@Module({
  imports: [TypeOrmModule.forFeature([Player])],
  providers: [PlayersService],
  controllers: [PlayersController],
  exports: [PlayersService], // Important pour que Ranking et Matches y aient accès
})
export class PlayersModule {}
