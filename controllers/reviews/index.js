import path from "path";

import getRoomReviews from "./getRoomReviews.js";
import getHotelReviews from "./getHotelReviews.js";
import postRoomReview from "./postRoomReview.js";
import postHotelReview from "./postHotelReview.js";

const __dirname = path.resolve();

export const uploadFiles = (files, folderName, id) => {
  const pictures = [];

  Object.keys(files).forEach((key) => {
    console.log(key);
    for (let i = 0; i < files[key].length; i++) {
      const file = files[key][i];
      const fileName = id + "_" + i + path.extname(file.name);
      console.log(file, folderName, __dirname);
      const filepath = path.join(__dirname, "uploads", folderName, fileName);
      console.log(filepath);
      file.mv(filepath);
      pictures.push(filepath);
    }
  });

  return pictures;
};

export default {
  getRoomReviews,
  getHotelReviews,
  postRoomReview,
  postHotelReview,
};
