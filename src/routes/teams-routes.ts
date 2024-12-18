import { Router } from "express";
import { TeamsController } from "@/controllers/TeamsController";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const teamsRouter = Router()
const teamsController = new TeamsController()

teamsRouter.post("/", ensureAuthenticated, verifyUserAuthorization(['admin']), teamsController.create)
teamsRouter.get("/", ensureAuthenticated, verifyUserAuthorization(['admin']), teamsController.index)