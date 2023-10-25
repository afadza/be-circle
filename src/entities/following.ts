import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Users } from "./user";

@Entity({ name: "following" })
export class Follow {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Users, (user) => user.followingToUser, {
		onUpdate: "CASCADE",
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "following_id" })
	followingToUser: Users;

	@ManyToOne(() => Users, (user) => user.followerToUser, {
		onUpdate: "CASCADE",
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "follower_id" })
	followerToUser: Users;
}