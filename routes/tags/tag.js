import express from "express";

import tagControllers from "../../controllers/tags/index.js";

const { getAmenityTags, getPictureTags, getRuleTags } = tagControllers;

const router = express.Router();

router.get("/amenity-tags", getAmenityTags);
router.get("/picture-tags", getPictureTags);
router.get("/rule-tags", getRuleTags);

export default router;
