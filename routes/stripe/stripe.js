import express from "express";

import webHook from "../../controllers/stripe/webHook.js";

const router = express.Router();

router.post('/web-hooks', webHook)

export default router;