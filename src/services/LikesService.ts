import { Repository } from 'typeorm';
import { Likes } from '../entities/likes';
import { AppDataSource } from '../data-source';
import { createLikesSchema } from '../utils/validator/Thread';
import { Request, Response } from 'express';

export default new (class LikesServices {
  private readonly LikesRepository: Repository<Likes> = AppDataSource.getRepository(Likes);

  async find(req: Request, res: Response): Promise<Response> {
    try {
      const likes = await this.LikesRepository.find({
        relations: ['userId', 'threadId'],
      });
      return res.status(200).json(likes);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error while getting replies' });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const { error, value } = createLikesSchema.validate(data);
      if (error) {
        return res.status(400).json({ Error: error.details[0].message });
      }

      const loginSession = res.locals.logingSession;

      const likeSelected: Likes | null  = await this.LikesRepository.findOne({
        where: {
          userId: {
            id: loginSession.user.id,
          },
          threadId: {
            id: value.threadId,
          }
        }
      })

      if (likeSelected) {
        await this.LikesRepository.remove(likeSelected)
        return res.status(200).json({message: 'Like remove'});
      }

      const likes = this.LikesRepository.create({
        threadId: value.threadId,
        userId: {
          id: loginSession.user.id
        }
      });

      const createLikes = await this.LikesRepository.save(likes);
      res.status(200).json(createLikes);
    } catch (err) {
      return res.status(500).json({ error: 'Error while creating replies' });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const like = await this.LikesRepository.findOne({
        where: { id: id },
      });

      if (!like) return res.status(404).json({ Error: 'Like ID not found' });

      const response = await this.LikesRepository.delete({ id: id });
      return res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: 'Bad Request' });
    }
  }

})();
