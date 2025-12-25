import Review from '../models/Review.js';
import Restaurant from '../models/Restaurant.js';
import Item from '../models/Item.js';
import { reviewSchema } from '../utils/validation.js';

const updateRatings = async (restaurantId, itemId) => {
  const itemReviews = await Review.find({ item: itemId }).select('rating');
  const itemAvg = itemReviews.length ? itemReviews.reduce((a, c) => a + c.rating, 0) / itemReviews.length : 0;
  await Item.findByIdAndUpdate(itemId, { rating: itemAvg });
  const restReviews = await Review.find({ restaurant: restaurantId }).select('rating');
  const restAvg = restReviews.length ? restReviews.reduce((a, c) => a + c.rating, 0) / restReviews.length : 0;
  await Restaurant.findByIdAndUpdate(restaurantId, { rating: restAvg });
};

export const addReview = async (req, res) => {
  const data = await reviewSchema.validateAsync(req.body);
  const r = await Review.create({ user: req.user.id, restaurant: data.restaurantId, item: data.itemId, rating: data.rating, comment: data.comment });
  await updateRatings(data.restaurantId, data.itemId);
  res.json({ ok: true, data: r });
};

export const getRestaurantReviews = async (req, res) => {
  const id = req.params.restaurantId;
  const reviews = await Review.find({ restaurant: id }).populate('item').populate('user', 'name');
  res.json({ ok: true, data: reviews });
};
