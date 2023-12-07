import { Repository } from "typeorm";
import { Threads } from "../entities/threads";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { createThreadSchema } from "../utils/validator/Thread";
const cloudinary = require("cloudinary").v2;

export default new (class ThreadService {
  private readonly ThreadRepository: Repository<Threads> =
    AppDataSource.getRepository(Threads);

  async find(req: Request, res: Response): Promise<Response> {
    try {
      const threads = await this.ThreadRepository.find({
        relations: ["createdById", "replies", "likes.userId", "replies.userId"],
        select: {
          likes: {
            id: true,
            userId: {
              id: true,
            },
          },
        },
        order: {
          id: "DESC",
        },
      });
      return res.status(200).json(threads);
    } catch (err) {
      return res.status(500).json({ error: "Error while getting threads" });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = {
        content: req.body.content,
        image: req.file ? req.file.path : null,
        createdById: res.locals.logingSession.user.id,
      };

      const { error } = createThreadSchema.validate(data);

      if (error) {
        return res.status(400).json({ Error: error.details[0].message });
      }

      cloudinary.config({
        cloud_name: "dsus7hrnk",
        api_key: "758959438735139",
        api_secret: "WCLAlQ8H7kIIDDLF_imQIDJHW_Q",
      });

      if (req.file && req.file.path) {
        const cloudinaryResponse = await cloudinary.uploader.upload(
          data.image,
          { folder: "threads" }
        );
        data.image = cloudinaryResponse.secure_url;
      }

      // const cloudinaryResponse = await cloudinary.uploader.upload(data.image, {
      //   folder: "threads",
      // });
      const thread = this.ThreadRepository.create({
        content: data.content,
        image: data.image,
        createdById: res.locals.logingSession.user.id,
      });


      const createdThread = await this.ThreadRepository.save(thread);
      res.status(200).json(createdThread);
    } catch (err) {
      console.log(err);

      return res.status(500).json({ error: "Error while creating thread" });
    }
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const thread = await this.ThreadRepository.findOne({
        relations: ["createdById", "replies", "likes.userId", "replies.userId"],
        where: {
          id: id,
        },
        order: {
          replies: {
            id: "DESC",
          },
        },
      });
      return res.status(200).json(thread);
    } catch (error) {
      return res.status(500).json({ error: "Error while getting a thread" });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const thread = await this.ThreadRepository.findOne({
        where: { id: id },
      });
      const data = req.body;
      const { error, value } = createThreadSchema.validate(data);

      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      thread.content = value.content;
      thread.image = value.image;

      const update = await this.ThreadRepository.save(thread);
      return res.status(200).json(update);
    } catch (error) {
      res.status(500).json({ error: "Error while updating thread" });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const thread = await this.ThreadRepository.findOne({
        where: { id: id },
      });

      if (!thread)
        return res.status(404).json({ Error: "Thread ID not found" });

      const response = await this.ThreadRepository.delete({ id: id });
      return res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: "Bad Request" });
    }
  }
})();
