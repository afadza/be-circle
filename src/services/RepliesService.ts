import { Repository } from 'typeorm';
import { Replies } from '../entities/replies';
import { AppDataSource } from '../data-source';
import { createRepliesSchema } from '../utils/validator/Thread';
import { Request, Response } from 'express';
const cloudinary = require('cloudinary').v2;

export default new (class RepliesService {
  private readonly RepliesRepository: Repository<Replies> = AppDataSource.getRepository(Replies);

  async find(req: Request, res: Response): Promise<Response> {
    try {
      const replies = await this.RepliesRepository.find({
        relations: ['userId', 'threadId'],
        order: {
         id: 'DESC',
        },
      });
      return res.status(200).json(replies);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error while getting replies' });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = {
        content: req.body.content,
        image: req.file ? req.file.path : null,
        userId: res.locals.logingSession.user.id,
        threadId: req.body.threadId,
      };

      const { error } = createRepliesSchema.validate(data);

      if (error) {
        return res.status(400).json({ Error: error.details[0].message });
      }

      cloudinary.config({
        cloud_name: 'dsus7hrnk',
        api_key: '758959438735139',
        api_secret: 'WCLAlQ8H7kIIDDLF_imQIDJHW_Q',
      });

      // Handle Cloudinary upload only if there is a file
      if (req.file && req.file.path) {
        const cloudinaryResponse = await cloudinary.uploader.upload(data.image, { folder: 'replies' });
        data.image = cloudinaryResponse.secure_url;
      }

      const replies = this.RepliesRepository.create({
        content: data.content,
        image: data.image,
        userId: res.locals.logingSession.user.id,
        threadId: data.threadId,
      });

      const createReplies = await this.RepliesRepository.save(replies);
      return res.status(200).json(createReplies);
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
