import express from "express";

import filterControllers from "../../controllers/filters/index.js";

const {
  getAmenityList,
  getPropertyRuleList,
  getCityList,
  getFilterList,
  postAmenity,
} = filterControllers;

const router = express.Router();

router.get("/amenity-list", getAmenityList);
router.get("/rule-list", getPropertyRuleList);
router.get("/city-list", getCityList);
router.get("/filter-list", getFilterList);
router.get("/amenity", postAmenity);

export default router;
