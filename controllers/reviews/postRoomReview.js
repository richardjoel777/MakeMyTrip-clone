import { db } from "../../models/index.js";
import { uploadFiles } from "./index.js";

const Picture = db.Picture;
const Review = db.Review;

export default async (req, res) => {
  try {
    const review = await Review.create({
      title: req.body.title,
      description: req.body.description,
      rating: req.body.rating,
      userId: req.userId,
    });

    await review.addRooms(req.body.roomId);

    // console.log(req.files);

    const files = req.files;

    console.log(files);

    const pictures = uploadFiles(files, "reviews", review.id);

    const pictureData = [];

    for (let i = 0; i < pictures.length; i++) {
      const picture = pictures[i];
      console.log(picture);
      const pic = await Picture.create({
        url: picture,
        tagId: req.body.tags[i],
      });
      pictureData.push(pic);
    }
    await review.addPictures(pictureData);
    res.status(200).send(review);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};
