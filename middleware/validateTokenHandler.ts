import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import jwt from "jsonwebtoken";

const validateToken = asyncHandler(
  async (req: Request, res: Response, next) => {
    console.log("VALIDATING");
    let token;
    let authHeader: any =
      req.headers.Authorization || req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!,
        (err: any, decoded: any) => {
          if (err) {
            res.status(401);
            throw new Error("User is not authorized");
          }
          //   req.user = decoded.user;
          console.log(decoded);
          //   next();
        }
      );
      //   if (!token) {
      //     res.status(404);
      //     throw new Error("User is not authorized or token is missing");
      //   }
    }
  }
);

export default validateToken;
