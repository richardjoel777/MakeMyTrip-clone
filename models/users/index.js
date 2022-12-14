import { default as User } from "./user.js";
import { default as Profile } from "./profile.js";
import { default as Otp } from "./otp.js";

const users = {};

users.User = User;
users.Profile = Profile;
users.Otp = Otp;

export default users;
