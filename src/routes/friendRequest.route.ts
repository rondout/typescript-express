import { Router } from "express";
import friendRequestService from "../services/friendRequest.service";
import { MakeFriendsRequestParams } from "../models/friends.model";
import { PermissionRequire } from "./handlers";
import { Authority } from "../models/auth.model";
import authService from "../services/auth.service";
const friendRequestRouter = Router();

friendRequestRouter.get(
  "/",
  PermissionRequire(Authority.ADMIN),
  async (req, res) => {
    const friendRequest = await friendRequestService.findAllRequest();
    res.send(friendRequest);
  }
);
// 我发起的
friendRequestRouter.get("/byMe", async (req, res) => {
  const currentUser = await authService.getCurrentInfo(req);
  const result =  await friendRequestService.findOwnRequest({
    // @ts-ignore
    from: currentUser.data._id,
  });
  res.send(result)
});

// 加我为好友的
friendRequestRouter.get("/toMe", async (req, res) => {
  const currentUser = await authService.getCurrentInfo(req);
  const result =  await friendRequestService.findOwnRequest({
    // @ts-ignore
    to: currentUser.data._id,
  });
  res.send(result)
});

// 和我有关的
friendRequestRouter.get("/aboutMe", async (req, res) => {
  const currentUser = await authService.getCurrentInfo(req);
  const result =  await friendRequestService.findRequestAboutMe({
    // @ts-ignore
    id: currentUser.data._id,
  });
  res.send(result)
});

// 创建好友申请
friendRequestRouter.post("/", async (req, res) => {
  const params = req.body as MakeFriendsRequestParams;
  const friendRequest = await friendRequestService.postFriendRequest(params);
  res.send(friendRequest);
});

export default friendRequestRouter;
