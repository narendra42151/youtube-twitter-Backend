

import { Router } from "express";
import { verifyJWT } from '../middlewares/auth,middlewear.js';






const router=Router();

router.use(verifyJWT); 

import {
    createTweet, deleteTweet, getUserTweets,
    updateTweet
} from "../controllers/tweet.controller.js";


router.route("/").post(createTweet);
router.route("/user/:userId").get(getUserTweets);
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);


export default router;