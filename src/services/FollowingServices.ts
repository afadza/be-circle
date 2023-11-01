import { Repository } from 'typeorm';
import { Follow } from '../entities/following';
import { AppDataSource } from '../data-source';
import { followingSchema } from '../utils/validator/Thread';
import { Request, Response } from 'express';

export default new (class FollowingServices {
  private readonly FollowingRepository: Repository<Follow> = AppDataSource.getRepository(Follow);

  async find(req: Request, res: Response): Promise<Response> {
    try {
      const following = await this.FollowingRepository.find({
        relations: ['followers',  'userId'],
      });
      return res.status(200).json(following);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error while getting following' });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const { error, value } = followingSchema.validate(data);
      if (error) {
        return res.status(400).json({ Error: error.details[0].message });
      }

      const loginSession = res.locals.logingSession;
      const followingSelected: Follow | null = await this.FollowingRepository.findOne({
        where: {
          userId: {
            id: loginSession.user.id,
          },
          followers: {
            id: value.followers,
          },
        },
      });

      if (followingSelected) {
        await this.FollowingRepository.remove(followingSelected);
        return res.status(200).json({ message: 'Following remove' });
      }

      const following = this.FollowingRepository.create({
        followers: value.followers,
        userId: {
          id: loginSession.user.id,
        },
      });

      const createFollowing = await this.FollowingRepository.save(following);
      res.status(200).json(createFollowing);
    } catch (err) {
      return res.status(500).json({ error: 'Error while creating following' });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const following = await this.FollowingRepository.findOne({
        where: { id: id },
      });

      if (!following) return res.status(404).json({ Error: 'following ID not found' });

      const response = await this.FollowingRepository.delete({ id: id });
      return res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: 'Bad Request' });
    }
  }
})();
