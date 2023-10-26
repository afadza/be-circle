import * as Joi from 'joi';
import { join } from 'path';

export const createThreadSchema = Joi.object({
  content: Joi.string().required(),
  image: Joi.string(),
  createdById: Joi.number()
});

export const createUserSchema = Joi.object({
  username: Joi.string(),
  full_name: Joi.string(),
  email: Joi.string(),
  password: Joi.string(),
  photo_profile: Joi.string(),
  bio: Joi.string()
});

export const createRepliesSchema = Joi.object({
  image: Joi.string().required(),
  content: Joi.string().required(),
  userId: Joi.number(),
  threadId: Joi.number()
})

export const createLikesSchema = Joi.object({
  userId: Joi.number().required(),
  threadId: Joi.number().required()
})

export const followingSchema = Joi.object({
	followingToUser: Joi.number(),
});

export const followerSchema = Joi.object({
	followerToUser: Joi.number(),
});


export const registerSchema = Joi.object({
  full_name: Joi.string(),
  username: Joi.string(),
  email: Joi.string(),
  password: Joi.string()
})

export const loginSchema = Joi.object({
  email: Joi.string(),
  password: Joi.string()
})