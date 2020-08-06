import express, { Request, Response } from "express";
import { Order } from "../models/order";
import { requireLogin } from "@fangman/common";

const router = express.Router();

router.get("/api/orders", requireLogin, async (req: Request, res: Response) => {
  // each order also fetches its course info
  const orders = await Order.find({ userId: req.user!.id }).populate("course");
  res.send(orders);
});

export { router as indexAllOrderRouter };
