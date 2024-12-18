import { Router } from "express";
import { usersRoutes } from "./user-routes";
import { sessionsRouter } from "./sessions-routes";

const routes = Router()

routes.use("/users", usersRoutes)
routes.use("/sessions", sessionsRouter)

export { routes }