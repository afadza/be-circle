// reply.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Users } from './user';
import { Threads } from './threads';

@Entity({ name: 'likes' })
export class Likes{
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.likes)
  userId: Users;

  @ManyToOne(() => Threads, (thread) => thread.likes)
  threadId: Threads;

  @CreateDateColumn({ type: 'date' })
  created_at: Date;

  @UpdateDateColumn({ type: 'date' })
  updated_at: Date;
}
