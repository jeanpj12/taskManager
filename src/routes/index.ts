import { Router } from "express";
import { usersRoutes } from "./user-routes";
import { sessionsRouter } from "./sessions-routes";
import { teamsRouter } from "./teams-routes";
import { tasksRoutes } from "./tasks-routes";

const routes = Router()

routes.use("/users", usersRoutes)
routes.use("/sessions", sessionsRouter)
routes.use("/teams", teamsRouter)
routes.use("/tasks", tasksRoutes)

export { routes }