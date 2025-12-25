import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  address: Joi.string().allow('', null)
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const restaurantSchema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string().required(),
  cuisineTypes: Joi.array().items(Joi.string()).default([]),
  about: Joi.string().allow(''),
  contactInfo: Joi.string().allow('')
});

export const itemAddSchema = Joi.object({
  restaurantId: Joi.string().required(),
  name: Joi.string().required(),
  imageUrl: Joi.string().uri().required(),
  price: Joi.number().min(0).required(),
  category: Joi.string().required(),
  isAvailable: Joi.boolean().default(true)
});

export const itemUpdateSchema = Joi.object({
  name: Joi.string(),
  imageUrl: Joi.string().uri(),
  price: Joi.number().min(0),
  category: Joi.string(),
  rating: Joi.number().min(0).max(5),
  totalOrders: Joi.number().min(0),
  isAvailable: Joi.boolean(),
  isTopSelling: Joi.boolean()
}).min(1);

export const reviewSchema = Joi.object({
  restaurantId: Joi.string().required(),
  itemId: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().allow('')
});

export const cartAddSchema = Joi.object({
  itemId: Joi.string().required(),
  quantity: Joi.number().min(1).required()
});

export const cartUpdateSchema = Joi.object({
  itemId: Joi.string().required(),
  quantity: Joi.number().min(1).required()
});
