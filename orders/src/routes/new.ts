import mongoose from "mongoose";
import express, { Request, Response } from "express";
import {
  requireLogin,
  validateRequest,
  RouteNotFoundError,
  OrderStatus,
  BadRequestError,
} from "@fangman/common";
import { body } from "express-validator";
import { Order } from "../models/order";
import { Course } from "../models/course";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/orders",
  requireLogin,
  [
    body("courseId")
      .not()
      .isEmpty()
      // must provide a mongoose document object id.
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Course Id must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { courseId } = req.body;
    // find the course the user is trying to order in the database.
    const course = await Course.findById(courseId);
    if (!course) {
      throw new RouteNotFoundError();
    }
    // make sure the ticker is not been reserved.
    const isReserved = await course.isReserved();
    if (isReserved) {
      throw new BadRequestError("Course has been reserved!");
    }
    // calculare an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + 0.2 * 60);
    // build the order and save it in to the database
    const order = Order.build({
      userId: req.user!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      course,
    });
    await order.save();
    // publish an event saying that an order has been created.
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      course: {
        id: course.id,
        price: course.price,
      },
    });
    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
