
import { Router } from "express";

import { verifyJWT } from "../middlewares/auth,middlewear.js";



const router= Router();

router.use(verifyJWT);

import {
    getLikedVideos, toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike
} from "../controllers/like.controller.js";

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/videos").get(getLikedVideos);
export default router;














