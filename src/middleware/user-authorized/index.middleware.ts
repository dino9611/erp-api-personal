import { Request, Response, NextFunction } from "express";
import { db } from "@src/database/database";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service";
export default function (req: Request, res: Response, next: NextFunction) {
  // const authorizationHeader: string = req.headers.authorization;

  // if (!authorizationHeader){

  // }

  // const verifyToken = new VerifyTokenUserService(db);
  next();
}
