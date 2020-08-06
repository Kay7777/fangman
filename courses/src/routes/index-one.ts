import express, { Request, Response } from "express";
import { RouteNotFoundError } from "@fangman/common";
import { Course } from "../models/course";

const router = express.Router();

router.get("/api/courses/:id", async (req: Request, res: Response) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new RouteNotFoundError();
  }

  res.send(course);
});

export { router as indexOneCourseRouter };
