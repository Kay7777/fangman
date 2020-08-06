import express, { Request, Response } from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, RouteNotFoundError, currentUser } from "@fangman/common";
import { createOrderRouter } from "./routes/new";
import { deleteOneOrderRouter } from "./routes/delete";
import { indexOneOrderRouter } from "./routes/index-one";
import { indexAllOrderRouter } from "./routes/index-all";

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

// index-all, index-one, new, delete
app.use(createOrderRouter);
app.use(indexOneOrderRouter);
app.use(indexAllOrderRouter);
app.use(deleteOneOrderRouter);

app.all("*", async (req: Request, res: Response) => {
  throw new RouteNotFoundError();
});

app.use(errorHandler);

export { app };
