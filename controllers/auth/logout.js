export default async (req, res) => {
  res
    .setHeader("Set-Cookie", "jwt=;Path=/;HttpOnly")
    .status(200)
    .send("Logged out.");
};
