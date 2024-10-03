import { Router } from 'express';
import {
    changeCurrentPassowrd,
    getCureentUser,
    getUserChannelProfile,
    getWatchHistory,
    loginUser,

    logOutUser,
    refreshAcessTOken,
    registeruser,
    updateAccountDetails,
    updateuserAvatar,
    updateuserCoverImage
} from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth,middlewear.js';
import { upload } from '../middlewares/multer.middleware.js';



const router = Router();

// router.route("/register").post((req, res, next) => {
//     console.log("Register route hit");
//     next();  // Proceed to the actual controller (registeruser)
// });

router.route("/register").post(upload.fields([{
    name: "avatar",
    maxCount : 1,

} , {
    name : "coverImage",
    maxCount : 1,

}]),registeruser);

router.route("/login").post(loginUser)


//secured routes

router.route("/logout").post(verifyJWT,logOutUser) 

router.route("/refresh-token").post(refreshAcessTOken)

router.route("/change-password").post(verifyJWT,changeCurrentPassowrd)
router.route("/current-user").get(verifyJWT,getCureentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateuserAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateuserCoverImage)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getWatchHistory)


   

// router.route("/registerr").post((req, res) => {
//   console.log("Simple register route hit");
//   res.status(202).json({
//       message: 'Simple response working'
//   });
// });


export default router;
