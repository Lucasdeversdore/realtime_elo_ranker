import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  playerAId: string;

  @Column()
  playerBId: string;

  @Column()
  result: string; // "WINNER_A", "WINNER_B", ou "DRAW"

  @Column()
  oldRankA: number;

  @Column()
  newRankA: number;

  @Column()
  oldRankB: number;

  @Column()
  newRankB: number;

  @CreateDateColumn()
  createdAt: Date;
}