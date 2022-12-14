import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth/auth.js";
import hotelRouter from "./routes/hotels/hotel.js";
import tagRouter from "./routes/tags/tag.js";
import reviewRouter from "./routes/reviews/review.js";
import filterRouter from "./routes/filters/filter.js";
import paymentRouter from "./routes/payments/payments.js";
import stripeRouter from "./routes/stripe/stripe.js";

const app = express();

app.use(cors());

app.use(express.json({verify: (req,res,buf) => { req.rawBody = buf }}));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/hotels", hotelRouter);
app.use("/tags", tagRouter);
app.use("/reviews", reviewRouter);
app.use("/filters", filterRouter);
app.use("/payments", paymentRouter);
app.use("/stripe", stripeRouter);

export default app;