import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireLogin, validateRequest } from "@fangman/common";
import { Course } from "../models/course";
import { CourseCreatedPublisher } from "../events/publishers/course-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/courses",
  requireLogin,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const course = Course.build({
      title,
      price,
      userId: req.user!.id,
    });
    await course.save();
    // publish the new course
    new CourseCreatedPublisher(natsWrapper.client).publish({
      id: course.id,
      title: course.title,
      price: course.price,
      userId: course.userId,
      version: course.version,
    });

    res.status(201).send(course);
  }
);

export { router as createCourseRouter };
