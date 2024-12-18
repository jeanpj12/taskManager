import { Router } from "express";
import { usersRoutes } from "./user-routes";
import { sessionsRouter } from "./sessions-routes";
import { teamsRouter } from "./teams-routes";

const routes = Router()

routes.use("/users", usersRoutes)
routes.use("/sessions", sessionsRouter)
routes.use("/teams", teamsRouter)

export { routes }