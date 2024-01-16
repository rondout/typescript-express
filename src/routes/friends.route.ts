import { Router } from "express";
import friendsService from "../services/friends.service";
const friendsRouter = Router();

friendsRouter.get("/", async (req, res) => {
  const friends = await friendsService.getAllFriends(req);
  res.send(friends);
});

// 获取单个好友详情
friendsRouter.get("/:_id", async (req, res) => {
  const friends = await friendsService.getFriendDetailById(req.params._id);
  res.send(friends);
});

export default friendsRouter;
