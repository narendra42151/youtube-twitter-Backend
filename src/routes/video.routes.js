import { Router } from 'express';

import { upload } from '../middlewares/multer.middleware.js';

import {
    deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo
} from "../controllers/video.controller.js";

import { verifyJWT } from '../middlewares/auth,middlewear.js';

const router= Router();

router.use(verifyJWT); 
router
    .route("/")
    .get(getAllVideos)
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
            
        ]),
        publishAVideo
    );

router
    .route("/:videoId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router  


/*   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmUxOTlhNzAwZjIyY2I1ZWQ1MTQ1MzMiLCJlbWFpbCI6Im5hcmVuZHJhQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoibmFyZW5kcmEiLCJmdWxsTmFtZSI6Im5hcmVuZHJhZCIsImlhdCI6MTcyNjA2MTA3OSwiZXhwIjoxNzI2MTQ3NDc5fQ.G8v0JPNbpYDkc1BASmyGMoWGtgFjTn_KmgMufbu3UTg */