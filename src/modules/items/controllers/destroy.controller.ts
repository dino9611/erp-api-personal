import { NextFunction, Request, Response } from "express";
import { DestroyItemService } from "../services/destroy.service.js";
import { db } from "@src/database/database.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";
import { ApiErrorCustom } from "@src/utils/api-error-custom.js";

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();

    db.startTransaction();
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throw new ApiErrorCustom(401, "Unauthorized Access");
    }

    const verifyTokenUserService = new VerifyTokenUserService(db);
    const payload = await verifyTokenUserService.handle(authorizationHeader);

    if (payload.role !== "super admin") {
      throw new ApiErrorCustom(403, "Forbidden Access");
    }
    console.log(req.params.id, "object id");
    const destroyItemService = new DestroyItemService(db);
    const result = await destroyItemService.handle(req.params.id, session);

    await db.commitTransaction();

    res.status(204).json(result);
  } catch (error) {
    console.log(error);
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
