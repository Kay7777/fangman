import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { validateRequest, BadRequestError } from "@fangman/common";
import { Password } from "../services/password";
import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/auth/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordMatched = await Password.compare(user.password, password);
    if (!passwordMatched) {
      throw new BadRequestError("Invalid Credentials");
    }
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

    res.status(200).send(user);
  }
);

export { router as signinRouter };
