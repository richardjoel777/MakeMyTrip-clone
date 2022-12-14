import jwt from "jsonwebtoken";
import authConfig from "../../config/auth.js";

export const auth = async (req, res, next) => {
  const token = req.cookies.jwt;
  console.log("Token", token);
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }
  try {
    const decoded = jwt.verify(token, authConfig.secret);
    req.userId = decoded.id;
    console.log("User Id", req.userId);
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};
