import * as Joi from 'joi';

export const createThreadSchema = Joi.object({
  content: Joi.string().allow('', null),
  image: Joi.string().allow('', null),
  createdById: Joi.number().allow('', null)
});

export const createUserSchema = Joi.object({
  username: Joi.string().allow('', null),
  full_name: Joi.string().allow('', null),
  email: Joi.string().allow('', null),
  password: Joi.string().allow('', null),
  photo_profile: Joi.string().allow('', null),
  bio: Joi.string().allow('', null),
});

export const createRepliesSchema = Joi.object({
  image: Joi.string().allow('', null),
  content: Joi.string().allow('', null),
  userId: Joi.number().allow('', null),
  threadId: Joi.number().allow('', null)
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