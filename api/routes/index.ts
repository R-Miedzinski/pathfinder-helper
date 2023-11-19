import express from "express";
import PingController from "../controllers/ping";

const router = express.Router();

router.get("/ping", async (_req, res) => {
  const response = await PingController.getTestMessage();
  return res.send(response.message);
});

export default router;