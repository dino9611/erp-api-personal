import { NextFunction, Request, Response } from "express";
import { ReadItemService } from "../services/read.service.js";
import { db } from "@src/database/database.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";
import { ApiErrorCustom } from "@src/utils/api-error-custom.js";

export const read = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throw new ApiErrorCustom(401, "Unauthorized Access");
    }

    const verifyTokenUserService = new VerifyTokenUserService(db);
    const payload = await verifyTokenUserService.handle(authorizationHeader);

    if (payload.role !== "super admin") {
      throw new ApiErrorCustom(403, "Forbidden Access");
    }

    const readItemService = new ReadItemService(db);

    const result = await readItemService.handle(req.params.id);
    // console.log(result, "result read");
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};
