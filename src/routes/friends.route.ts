import { Router } from "express";
import friendsService from "../services/friends.service";
const friendsRouter = Router();

friendsRouter.get("/", async (req, res) => {
  const friends = await friendsService;
  res.send(friends);
});

export default friendsRouter;
