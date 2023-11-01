import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from './user';

@Entity({ name: 'following' })
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.followers)
  userId: Users;

  @ManyToOne(() => Users, (user) => user.followers, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'following_id' })
  followers: Users;

  @ManyToOne(() => Users, (user) => user.following, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'follower_id' })
  following: Users;
}