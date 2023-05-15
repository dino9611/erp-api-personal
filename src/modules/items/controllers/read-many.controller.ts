import { NextFunction, Request, Response } from "express";

import { ReadManyItemService } from "../services/read-many.service.js";
import { QueryInterface } from "@src/database/connection";
import { db } from "@src/database/database.js";
import { VerifyTokenUserService } from "@src/modules/auth/services/verify-token.service.js";
import { ApiErrorCustom } from "@src/utils/api-error-custom.js";

export const readMany = async (req: Request, res: Response, next: NextFunction) => {
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

    const readManyItemService = new ReadManyItemService(db);

    const query: QueryInterface = {
      fields: (req.query.fields as string) ?? "",
      //   restrictedFields: ["password"],
      filter: (req.query.filter as any) ?? {},
      page: Number(req.query.page ?? 1),
      pageSize: Number(req.query.limit ?? 10),
      sort: (req.query.sort as string) ?? "",
    };

    const result = await readManyItemService.handle(query);
    // console.log(result);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
