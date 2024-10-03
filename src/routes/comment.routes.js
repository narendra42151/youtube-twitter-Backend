import { Router } from "express";
import {
    addComment, deleteComment, getVideoComments, updateComment
} from "../controllers/comment.controller.js";

import { verifyJWT } from "../middlewares/auth,middlewear.js";


const router =Router(verifyJWT);


router.route("/:videoId").get(getVideoComments).post(addComment);
router.route("/c/:commentId").delete(deleteComment).patch(updateComment) 


export default router;