import { db } from '../../models';

export default async (req, res) => {
  const id = req.params.id;
  const review = await db.HotelReview.findByPk(id);
  if (!review) {
    res.status(404).send({ message: 'Review not found' });
  }
  try {
    await review.update({
      title: req.body.title,
      description: req.body.description,
    });
    res.status(200).send({ message: 'Review updated' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
