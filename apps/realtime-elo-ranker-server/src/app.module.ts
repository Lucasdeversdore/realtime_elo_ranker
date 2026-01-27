import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersModule } from './players/players.module';
import { MatchesModule } from './matches/matches.module';
import { RankingModule } from './ranking/ranking.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3', // <--- Change ceci
      database: 'database.sqlite',
      autoLoadEntities: true,
      synchronize: true,
      // Supprime la ligne "driver: require('sqlite3')"
    }),
    PlayersModule,
    MatchesModule,
    RankingModule,
  ],
})
export class AppModule {}

