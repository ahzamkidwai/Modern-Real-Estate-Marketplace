import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  // console.log("We are inside verifyUser.js Middleware and req is : ", req);
  console.log(
    "We are inside verifyUser.js Middleware and req.cookies is : ",
    req.cookies
  );
  console.log(
    "We are inside verifyUser.js Middleware and req.cookies.access_token is : ",
    token
  );

  if (!token) {
    return next(errorHandler(401, "Unauthorized Token"));
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (error, user) => {
    if (error) {
      console.log("verifyUser chal raha hain verifyUser.js");
      return next(errorHandler(403, "Forbidden"));
    }
    req.user = user;
  });
  // console.log("VerifyUser.js mei jwt verification ke baad req hain : ", req);
  next();
};
