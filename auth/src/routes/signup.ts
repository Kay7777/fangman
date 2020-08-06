import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { validateRequest, BadRequestError } from "@fangman/common";
import { User } from "../models/user";
const router = express.Router();

router.post(
  "/api/auth/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("userName").notEmpty().withMessage("user name is required"),
    body("password")
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage("Password must be between 6 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password, userName } = req.body;
    const doc = await User.findOne({ email });
    if (doc) throw new BadRequestError("Email in use");
    const user = User.build({ email, password, userName });
    await user.save();
    // generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
        userName: user.userName,
      },
      process.env.JWT_KEY!
    );
    req.session = {
      jwt: userJwt,
    };
    res.status(201).send(user);
  }
);

export { router as signupRouter };
