import express, { Request, Response } from "express";
import { RouteNotFoundError, NotAuthorizedError } from "@fangman/common";
import { Course } from "../models/course";

const router = express.Router();

router.delete("/api/courses/:id", async (req: Request, res: Response) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new RouteNotFoundError();
  }

  if (course.userId !== req.user!.id) {
    throw new NotAuthorizedError();
  }

  await Course.findByIdAndDelete(req.params.id);

  res.send(course);
});

export { router as deleteOneCourseRouter };
