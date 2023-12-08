import { Router } from "express";
import userActionService from "../services/userAction.service";
import { getTokenFromRequest } from "./handlers";
import { parseUserFromToken } from "../utils";
import { PageLinkInterface } from "../models/response.model";
const userActionsRouter = Router();

userActionsRouter.get("/", async (req, res) => {
  const token = getTokenFromRequest(req);
  const tokenInfo = await parseUserFromToken(token);
  const userActions = await userActionService.getActions(
    req.query,
    tokenInfo._id
  );
  res.send(userActions);
});

userActionsRouter.get("/page", async (req, res) => {
  const token = getTokenFromRequest(req);
  const tokenInfo = await parseUserFromToken(token);
  const userActions = await userActionService.getActionsByPageLink(
    req.query as PageLinkInterface,
    tokenInfo._id
  );
  res.send(userActions);
});

userActionsRouter.post("/", async (req, res) => {
  const result = await userActionService.saveAction(req.body);
  res.send(result);
});

export default userActionsRouter;
