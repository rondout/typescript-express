import { Router } from "express";
import userActionService from "../services/userAction.service";
import { getTokenFromRequest } from "./handlers";
import { parseUserFromToken } from "../utils";
const userActionsRouter = Router();

userActionsRouter.get("/", async (req, res) => {
  const token = getTokenFromRequest(req);
  const tokenInfo = await parseUserFromToken(token);
  const users = await userActionService.getActions(req.query, tokenInfo._id);
  res.send(users);
});

userActionsRouter.post("/", async (req, res) => {
  const result = await userActionService.saveAction(req.body);
  res.send(result);
});

export default userActionsRouter;
