import express from "express";
import fileUpload from "express-fileupload";
import { auth } from "../../middlewares/auth/auth.js";

import reviewControllers from "../../controllers/reviews/index.js";

const { postHotelReview, getHotelReviews, getRoomReviews, postRoomReview } =
  reviewControllers;

const router = express.Router();

router.post(
  "/hotel-review",
  auth,
  fileUpload({ createParentPath: true }),
  postHotelReview
);
router.get("/hotel-reviews", getHotelReviews);
router.get("/room-reviews", getRoomReviews);
router.post(
  "/room-review",
  auth,
  fileUpload({ createParentPath: true }),
  postRoomReview
);

export default router;
