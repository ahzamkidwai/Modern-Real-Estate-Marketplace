import User from "../models/user-model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const existUser = await User.findOne({ email });
  if (existUser) {
    return res.status(207).json({
      success: false,
      message: "User already exists. Login to continue",
    });
  }
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "User Created Successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const validUser = await User.findOne({ email });
    if (!validUser) {
      res.status(404).json({
        success: false,
        message: "Login Failed!!! Unregistered user",
      });
      return next(errorHandler(404, "Login Failed!!! Unregistered user"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Wrong Credentials"));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET_KEY);
    const { password: pass, ...rest } = validUser._doc;

    res.cookie("access_token", token, { httpOnly: true }).json({
      rest,
    });
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
      const { password: pass, ...rest } = user._doc;
      res.cookie("access_token", token, { httpOnly: true }).status(200).json({
        rest,
      });
    } else {
      const generatedRandomPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedRandomPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      console.log(
        "We are inside authController.js and googleHandelr newUser is : ",
        newUser
      );
      await newUser.save();
      const token = jwt.sign(
        {
          id: newUser._id,
        },
        process.env.JWT_SECRET_KEY
      );
      const { password: pass, ...rest } = newUser._doc;
      res.cookie("access_token", token, { httpOnly: true }).status(200).json({
        rest,
      });
    }
  } catch (error) {
    next(error);
  }
};

/*
Syntax to throw error forcefully.

import {errorHandler} from "../utils/error.js"

next(errorHandler(501, "Login Failed!!! Unregistered user"))
*/
