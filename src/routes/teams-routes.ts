import { Router } from "express";
import { TeamsController } from "@/controllers/TeamsController";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import { TeamsMemberController } from "@/controllers/TeamsMemberController";

const teamsRouter = Router()
const teamsController = new TeamsController()
const teamsMemberController = new TeamsMemberController()

teamsRouter.post("/create", ensureAuthenticated, verifyUserAuthorization(['admin']), teamsController.create)
teamsRouter.post("/associate", ensureAuthenticated, verifyUserAuthorization(['admin']), teamsMemberController.create)
teamsRouter.get("/", ensureAuthenticated, verifyUserAuthorization(['admin']), teamsController.index)

export { teamsRouter }