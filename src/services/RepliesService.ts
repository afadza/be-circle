import { Repository } from 'typeorm';
import { Replies } from '../entities/replies';
import { AppDataSource } from '../data-source';
import { createRepliesSchema } from '../utils/validator/Thread';
import { Request, Response } from 'express';

export default new (class RepliesService {
  private readonly RepliesRepository: Repository<Replies> = AppDataSource.getRepository(Replies);

  async find(req: Request, res: Response): Promise<Response> {
    try {
      const replies = await this.RepliesRepository.find({
        relations: ['userId', 'threadId'],
      });
      return res.status(200).json(replies);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error while getting replies' });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const { error, value } = createRepliesSchema.validate(data);
      if (error) {
        return res.status(400).json({ Error: error.details[0].message });
      }

      const replies = this.RepliesRepository.create({
        image: value.image,
        content: value.content,
        userId: value.userId,
        threadId: value.threadId,
      });

      const createReplies = await this.RepliesRepository.save(replies);
      res.status(200).json(createReplies);
    } catch (err) {
      return res.status(500).json({ error: 'Error while creating replies' });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const reply = await this.RepliesRepository.findOne({
        where: { id: id },
      });

      if (!reply) return res.status(404).json({ Error: 'Reply ID not found' });

      const response = await this.RepliesRepository.delete({ id: id });
      return res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: 'Bad Request' });
    }
  }
})();
