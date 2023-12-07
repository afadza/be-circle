import { Repository } from "typeorm";
import { Users } from "../entities/user";
import { AppDataSource } from "../data-source";
import { createUserSchema } from "../utils/validator/Thread";
import { Request, Response } from "express";
import { error } from "console";
const cloudinary = require("cloudinary").v2;

export default new (class UserService {
  private readonly UserRepository: Repository<Users> =
    AppDataSource.getRepository(Users);

  async find(req: Request, res: Response): Promise<Response> {
    try {
      const user = await this.UserRepository.find({
        relations: ["following", "followers"],
      });
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ error: "Error while getting users" });
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
      return res.status(500).json({ error: "Error while creating users" });
    }
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const user = await this.UserRepository.findOne({
        relations: ["following", "followers"],
        where: { id: id },
      });

      res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ error: "Error while finding user" });
    }
  }

  // Bagian server-side
  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const user = await this.UserRepository.findOne({ where: { id: id } });
      const data = req.body;
      const image = req.file;
      const { error, value } = createUserSchema.validate(data);

      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Update data user berdasarkan nilai yang diterima
      user.username = value.username;
      user.full_name = value.full_name;
      user.email = value.email;
      user.password = value.password;
      user.bio = value.bio;

      // Hanya jika ada file yang diunggah, maka proses untuk Cloudinary dilakukan
      if (image) {
        cloudinary.config({
          cloud_name: "dsus7hrnk",
          api_key: "758959438735139",
          api_secret: "WCLAlQ8H7kIIDDLF_imQIDJHW_Q",
        });

        const cloudinaryResponse = await cloudinary.uploader.upload(
          image.path,
          {
            folder: "threads",
          }
        );

        // Perbarui URL foto profil di database dengan URL dari Cloudinary
        user.photo_profile = cloudinaryResponse.secure_url;
      }

      // Simpan perubahan user
      const update = await this.UserRepository.save(user);
      return res.status(200).json(update);
    } catch (err) {
      return res.status(500).json({ error: "Error while updating user" });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const user = await this.UserRepository.findOne({
        where: { id: id },
      });
      if (!user) return res.status(404).json({ Error: "User ID not found" });

      const response = await this.UserRepository.delete({ id: id });
      return res.status(200).json(response);
    } catch (err) {
      return res.status(500).json({ error: "Error while deleting user" });
    }
  }

  async follow(req: Request, res: Response): Promise<Response> {
    try {
      const loginSession = res.locals.logingSession;
      const followingId = Number(req.body.followingId);

      const follower = await this.UserRepository.findOne({
        where: { id: loginSession.user.id },
        relations: ["following"],
      });
      const following = await this.UserRepository.findOne({
        where: { id: followingId },
      });

      if (!follower || !following) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if the follower is already following the user
      const isFollowing = follower.following.some(
        (user) => user.id === following.id
      );

      if (isFollowing) {
        // If they are already following, unfollow
        follower.following = follower.following.filter(
          (user) => user.id !== following.id
        );
      } else {
        // If they are not following yet, follow
        follower.following.push(following);
      }

      await this.UserRepository.save(follower);

      return res.status(200).json(follower);
    } catch (error) {
      console.log(error);

      return res
        .status(500)
        .json({ error: "Error while following/unfollowing user" });
    }
  }
})();
