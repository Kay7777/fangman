import express, { Request, Response } from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, RouteNotFoundError, currentUser } from "@fangman/common";
import { createCourseRouter } from "./routes/new";
import { updateCourseRouter } from "./routes/update";
import { deleteOneCourseRouter } from "./routes/delete";
import { indexOneCourseRouter } from "./routes/index-one";
import { indexAllCourseRouter } from "./routes/index-all";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);

app.use(createCourseRouter);
app.use(updateCourseRouter);
app.use(indexOneCourseRouter);
app.use(indexAllCourseRouter);
app.use(deleteOneCourseRouter);

app.all("*", async (req: Request, res: Response) => {
  throw new RouteNotFoundError();
});

app.use(errorHandler);

export { app };
