import { Router } from "express";
import { TaskController } from "@/controllers/TaskController";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import { TaskStatusController } from "@/controllers/TaskStatusController";

const tasksRoutes = Router()
const taskController = new TaskController()
const taskStatusController = new TaskStatusController()

tasksRoutes.post("/", ensureAuthenticated, verifyUserAuthorization(['admin']), taskController.create)
tasksRoutes.get("/:user_id", ensureAuthenticated, verifyUserAuthorization(['admin', 'member']), taskController.index)
tasksRoutes.patch("/status/:task_id", ensureAuthenticated, verifyUserAuthorization(['admin', 'member']), taskStatusController.update)
tasksRoutes.patch("/update/:task_id", ensureAuthenticated, verifyUserAuthorization(['admin']), taskController.update)

export { tasksRoutes }