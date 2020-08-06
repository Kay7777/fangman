import express, { Request, Response } from "express";
import { Order } from "../models/order";
import {
  requireLogin,
  RouteNotFoundError,
  NotAuthorizedError,
} from "@fangman/common";

const router = express.Router();

router.get(
  "/api/orders/:orderId",
  requireLogin,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("course");
    if (!order) {
      throw new RouteNotFoundError();
    }
    if (order.userId !== req.user!.id) {
      throw new NotAuthorizedError();
    }
    res.send(order);
  }
);

export { router as indexOneOrderRouter };
