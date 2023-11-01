import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Request, Response } from 'express';
import { loginSchema, registerSchema } from '../utils/validator/Thread';
import { Users } from '../entities/user';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export default new (class AuthServices {
  private readonly AuthRepository: Repository<Users> = AppDataSource.getRepository(Users);

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;

      const { error, value } = registerSchema.validate(data);

      if (error) return res.status(400).json({ Error: error });

      const isCheckEmail = await this.AuthRepository.count({
        where: {
          email: value.email,
        },
      });

      if (isCheckEmail > 0) return res.status(400).json({ Error: 'Email already exists' });

      const hashPassword = await bcrypt.hash(value.password, 10);

      const user = this.AuthRepository.create({
        username: value.username,
        full_name: value.full_name,
        email: value.email,
        password: hashPassword,
      });

      const createdUser = await this.AuthRepository.save(user);
      return res.status(200).json({
        message: 'created successfully',
        user: createdUser,
      });
    } catch (err) {
      return res.status(500).json({ Error: `${err}` });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;

      const { error, value } = loginSchema.validate(data);
      const isCheckEmail = await this.AuthRepository.findOne({
        relations: ['following', 'followers'],
        where: {
          email: value.email,
        },
        // select: ['id', 'full_name', 'email', 'password'],
      });

      if (!isCheckEmail) return res.status(400).json({ error: 'Email not found' });

      const isCheckPassword = await bcrypt.compare(value.password, isCheckEmail.password);

      if (!isCheckPassword) return res.status(400).json({ error: 'Incorrect password' });

      const user = this.AuthRepository.create({
        id: isCheckEmail.id,
        full_name: isCheckEmail.full_name,
        username: isCheckEmail.username,
        email: isCheckEmail.email,
        following: isCheckEmail.following,
        followers: isCheckEmail.followers,
      });

      const token = await jwt.sign({ user }, 'secret', { expiresIn: '1h' });

      return res.status(200).json({
        user,
        token,
      });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async checkToken(req: Request, res: Response): Promise<Response> {
    try {
      const logingSession = res.locals.logingSession;

      const user = await this.AuthRepository.findOne({
        relations: ['following', 'followers'],
        where: {
          id: logingSession.user.id,
        },
      });

      return res.status(200).json({
        message: 'you are logging in',
        user,
      });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
})();
