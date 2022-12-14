import path from "path";
import { db } from "../../models/index.js";
import Joi from "@hapi/joi";

const __dirname = path.resolve();

const User = db.User;
const Profile = db.Profile;

const profileSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  profilePicture: Joi.object(),
  phone: Joi.string().length(10),
  gender: Joi.string(),
  dob: Joi.date().min("1-1-1900").max("now"),
});

export default async (req, res) => {
  const { error } = profileSchema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  try {
    const user = await User.findByPk(req.userId, {
      include: [
        {
          model: Profile,
          as: "profile",
        },
      ],
    });

    if (!user) {
      return res.status(400).send("User not found.");
    }
    const files = req.files;
    const folderName = "users";

    console.log("here", files);
    const result = [];

    Object.keys(files).forEach((key) => {
      console.log(key);
      const file = files[key];
      const fileName = user.id.toString() + path.extname(file.name);
      console.log(file, folderName, __dirname);
      const filepath = path.join(__dirname, "uploads", folderName, fileName);
      console.log("here");
      console.log(filepath);
      file.mv(filepath);
      result.push(filepath);
    });

    console.log(result);

    if (result.length > 0) {
      console.log("here");
      user.profile.avatar = result[0];
      await user.profile.save();
    }

    await user.profile.update(req.body);
    res
      .status(200)
      .send({ message: "profile updated successfully", profile: user.profile });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};
