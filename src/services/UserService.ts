import { Repository } from 'typeorm';
import { Users } from '../entities/user';
import { AppDataSource } from '../data-source';
import { createUserSchema } from '../utils/validator/Thread';
import { Request, Response } from 'express';
import { error } from 'console';

export default new (class UserService {
  private readonly UserRepository: Repository<Users> = AppDataSource.getRepository(Users);

  async find(req: Request, res: Response): Promise<Response> {
    try {
      const user = await this.UserRepository.find({
        relations: ['followerToUser', 'followingToUser'],
      });
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ error: 'Error while getting users' });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const { error, value } = createUserSchema.validate(data);
      if (error) {
        return res.status(400).json({ Error: error.details[0].message });
      }
      const users = this.UserRepository.create({
        username: value.username,
        full_name: value.full_name,
        email: value.email,
        password: value.password,
        photo_profile: value.photo_profile,
        bio: value.bio,
      });

      const createUser = await this.UserRepository.save(users);
      res.status(200).json(createUser);
    } catch (err) {
      console.log(error);
      return res.status(500).json({ error: 'Error while creating users' });
    }
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const user = await this.UserRepository.findOne({
        where: { id: id },
      });
      res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ error: 'Error while finding user' });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const user = await this.UserRepository.findOne({
        where: { id: id },
      });
      const data = req.body;
      const { error, value } = createUserSchema.validate(data);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      user.username = value.username;
      user.full_name = value.full_name;
      user.email = value.email;
      user.password = value.password;
      user.photo_profile = value.photo_profile;
      user.bio = value.bio;

      const update = await this.UserRepository.save(user);

      res.status(200).json(update);
    } catch (err) {
      return res.status(500).json({ error: 'Error while updating user' });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const user = await this.UserRepository.findOne({
        where: { id: id },
      });
      if (!user) return res.status(404).json({ Error: 'User ID not found' });

      const response = await this.UserRepository.delete({ id: id });
      return res.status(200).json(response);
    } catch (err) {
      return res.status(500).json({ error: 'Error while deleting user' });
    }
  }
})();
