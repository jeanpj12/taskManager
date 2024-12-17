import { Router } from "express";
import { usersRoutes } from "./user-routes";

const routes = Router()

routes.use("/users", usersRoutes)

export { routes }