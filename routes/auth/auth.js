import express from "express";
import { auth } from "../../middlewares/auth/auth.js";
import fileUpload from "express-fileupload";
import authControllers from "../../controllers/auth/index.js";

const {
  register,
  logout,
  profile,
  getProfile,
  getOtpResetPassword,
  getOtpRegistration,
  getOtpLogin,
  changePassword,
  resetPassword,
  checkUser,
  loginPassword,
  loginOtp,
} = authControllers;

const router = express.Router();

router.post("/check-user", checkUser);
router.post("/login-password", loginPassword);
router.post("/login-otp", loginOtp);
router.post("/register", register);
router.get("/logout", logout);
router.post("/profile", auth, fileUpload({ createParentPath: true }), profile);
router.get("/profile", auth, getProfile);
router.post("/otp-register", getOtpRegistration);
router.post("/otp-reset-password", getOtpResetPassword);
router.post("/otp-login", getOtpLogin);
router.post("/change-password", changePassword);
router.post("/reset-password", resetPassword);

export default router;
