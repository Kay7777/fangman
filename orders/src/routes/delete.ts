import express, { Request, Response } from "express";
import { Order } from "../models/order";
import {
  requireLogin,
  RouteNotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from "@fangman/common";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
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
    order.status = OrderStatus.Canacelled;
    await order.save();
    // publish an delete event
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      course: {
        id: order.course.id,
      },
    });
    res.status(204).send(order);
  }
);

export { router as deleteOneOrderRouter };
