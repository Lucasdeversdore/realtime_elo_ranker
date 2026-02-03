/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule'; // Nouveau import
import { PlayersModule } from './players/players.module';
import { MatchesModule } from './matches/matches.module';
import { RankingModule } from './ranking/ranking.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    // Initialise l'émetteur d'événements pour le temps réel
    EventEmitterModule.forRoot(),
    // Initialise le planificateur de tâches pour le matchmaking auto
    ScheduleModule.forRoot(),
    // Configuration de la base de données
    TypeOrmModule.forRoot({
      type: 'sqljs',
      location: 'database.sqlite',
      autoSave: true,
      autoLoadEntities: true,
      synchronize: true,
      useLocalForage: false,
    }),
    PlayersModule,
    MatchesModule,
    RankingModule,
  ],
})
export class AppModule {}