import express from "express";

import paymentControllers from "../../controllers/payments/index.js";

const { paymentSuccessful, paymentFailure, sendInvoice } = paymentControllers;

const router = express.Router();

router.get("/success/:id", paymentSuccessful);
router.get("/cancel/:id", paymentFailure);
router.get("/invoice/:id", sendInvoice);

export default router;
