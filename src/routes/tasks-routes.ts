import { Router } from "express";
import { TaskController } from "@/controllers/TaskController";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const tasksRoutes = Router()
const taskController = new TaskController()

tasksRoutes.post("/", ensureAuthenticated, verifyUserAuthorization(['admin']), taskController.create)
tasksRoutes.get("/:user_id", ensureAuthenticated, verifyUserAuthorization(['admin', 'member']), taskController.index)

export { tasksRoutes }