import express, { Request, Response } from "express";
import { currentUser } from "@fangman/common";

const router = express.Router();

router.get(
  "/api/auth/current_user",
  currentUser,
  (req: Request, res: Response) => {
    res.send(req.user || null);
  }
);

export { router as currentUserRouter };
