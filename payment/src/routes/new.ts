import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireLogin,
  validateRequest,
  BadRequestError,
  NotAuthorizedError,
  OrderStatus,
} from "@fangman/common";
import { Order } from "../models/order";

const router = express.Router();

router.post(
  "/api/payment",
  requireLogin,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("not fount order");
    }
    if (order.userId! === req.user!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Canacelled) {
      throw new BadRequestError("Cannot pay for an cancalled order");
    }
    res.send({ success: true });
  }
);

export { router as createChargeRouter };
