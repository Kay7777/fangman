import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  RouteNotFoundError,
  requireLogin,
  NotAuthorizedError,
  BadRequestError,
} from "@fangman/common";
import { Course } from "../models/course";
import { CourseUpdatedPublisher } from "../events/publishers/course-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/courses/:id",
  requireLogin,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be provided and must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
      throw new RouteNotFoundError();
    }

    if (course.orderId) {
      throw new BadRequestError("Cannot edit a reserved ticket");
    }

    if (course.userId !== req.user!.id) {
      throw new NotAuthorizedError();
    }

    course.set({
      title: req.body.title,
      price: req.body.price,
    });

    await course.save();

    // publish course updated event
    new CourseUpdatedPublisher(natsWrapper.client).publish({
      id: course.id,
      title: course.title,
      price: course.price,
      userId: course.userId,
      version: course.version,
    });

    res.send(course);
  }
);

export { router as updateCourseRouter };
