export default {
  secret: process.env.JWT_SECRET,
  expiresIn: "10d",
  otpExpiresIn: 10,
  saltCount: 10,
  mailingEmail: process.env.MAILING_EMAIL,
  mailingPassword: process.env.MAILING_PASSWORD,
};
