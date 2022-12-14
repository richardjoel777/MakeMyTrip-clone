import { db } from "../../models/index.js";

import getAmenityList from "./getAmenityList.js";
import getCityList from "./getCityList.js";
import getFilterList from "./getFilterList.js";
import getPropertyRuleList from "./getPropertyRuleList.js";

const Amenity = db.Amenity;

const postAmenity = async (req, res) => {
  const amenity = [
    { name: "Free Wifi", tagId: 22 },
    { name: "Spa", tagId: 22 },
    { name: "Swimming Pool", tagId: 22 },
    { name: "Care Taker", tagId: 5 },
    { name: "Restaurant", tagId: 5 },
    { name: "Balcony/Terrace", tagId: 5 },
    { name: "Living Room", tagId: 5 },
    { name: "Indoor Games", tagId: 5 },
    { name: "Cafe", tagId: 5 },
    {
      name: "Facilities for Guests with Disabilities",
      tagId: 5,
    },
    {
      name: "Room Service",
      tagId: 5,
    },
    {
      name: "Outdoor Sports",
      tagId: 5,
    },
    {
      name: "Bonfire",
      tagId: 5,
    },
    {
      name: "Bar",
      tagId: 5,
    },
    {
      name: "Barbeque",
      tagId: 5,
    },
    {
      name: "Elevator/Lift",
      tagId: 5,
    },
    {
      name: "Kitchenette",
      tagId: 5,
    },
    {
      name: "Parking",
      tagId: 5,
    },
    {
      name: "Bus Station Transfers",
      tagId: 23,
    },
    {
      name: "Airport Transfers",
      tagId: 23,
    },
    {
      name: "Railway Station Transfers",
      tagId: 23,
    },
  ];
  try {
    const amenities = await Amenity.bulkCreate(
      amenity.map((i) => {
        return {
          title: i.name,
          tagId: i.tagId,
        };
      })
    );
    res.status(200).send(amenities);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

export default {
  getAmenityList,
  getCityList,
  getFilterList,
  getPropertyRuleList,
  postAmenity,
};
