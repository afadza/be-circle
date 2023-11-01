import { Repository } from 'typeorm';
import { Follow } from '../entities/following';
import { AppDataSource } from '../data-source';
import { followerSchema } from '../utils/validator/Thread';
import { Request, Response } from 'express';

export default new (class FollowerServices {
  private readonly FollowerRepository: Repository<Follow> = AppDataSource.getRepository(Follow);

  async find(req: Request, res: Response): Promise<Response> {
    try {
      const follower = await this.FollowerRepository.find({
        relations: [ 'followerToUser'],
      });
      return res.status(200).json(follower);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error while getting follower' });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const { error, value } = followerSchema.validate(data);
      if (error) {
        return res.status(400).json({ Error: error.details[0].message });
      }

      const follower = this.FollowerRepository.create({
        following: value.following
      });

      const createLikes = await this.FollowerRepository.save(follower);
      res.status(200).json(createLikes);
    } catch (err) {
      return res.status(500).json({ error: 'Error while creating follower' });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const follower = await this.FollowerRepository.findOne({
        where: { id: id },
      });

      if (!follower) return res.status(404).json({ Error: 'Follower ID not found' });

      const response = await this.FollowerRepository.delete({ id: id });
      return res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: 'Bad Request' });
    }
  }
})();
