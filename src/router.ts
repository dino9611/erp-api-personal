import express, { Express } from "express";
import authRouter from "./modules/auth/router.js";
import itemRouter from "./modules/items/routes.js";
import usersRouter from "./modules/users/router.js";

export default function () {
  const app: Express = express();
  /**
   * Register all available modules
   * <modules>/router.ts
   */
  app.use(`/auth`, authRouter);
  app.use(`/users`, usersRouter);
  app.use("/items", itemRouter);

  return app;
}
