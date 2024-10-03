import { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";





const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params;

    const  userId  = req.user;
    
    const video = await Video.findById(videoId);

    if (!video) throw new ApiError(400, "Video not found");

    const isLiked = await Like.findOne({
        video: videoId,
        likedBy : userId._id
    })

    if(isLiked) {
        await Like.findByIdAndDelete(isLiked._id)
        return res.status(200).json(new ApiResponse(200,  "Like removed successfully"));
    }

    const like=await Like.create({
        video: videoId,
        likedBy : userId._id
    })
    
    return res.status(200).json(new ApiResponse(200, { like }, "Like toggled successfully"));

    
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params;
    const  userId  = req.user;

    const comment = await Comment.findById(commentId);

    if (!comment) throw new ApiError(400, "Comment not found");


    const isCommentLiked= await Like.findOne({
        comment: commentId,
        likedBy : userId._id
    })
    if(isCommentLiked) {
        await Like.findByIdAndDelete(isCommentLiked._id)
        return res.status(200).json(new ApiResponse(200,  "Like removed successfully"));

    }
    const like= await Like.create({
        comment: commentId,
        likedBy : userId._id
    })
    return res.status(200).json(new ApiResponse(200, { like }, "Like toggled successfully"));

   

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const user = req.user

    if (!tweetId) {
        return res.status(400).json({ message: 'Tweet ID is required' });
    }

    if (!isValidObjectId(tweetId)) {
        return res.status(400).json({ message: 'Invalid tweet ID' });
    }

    if (!user) {
        return res.status(401).json({ message: 'User ID is required' });
    }

    const likedAlready = await Like.findOne({
        tweet: tweetId,
        likedBy: user._id,
    });

    if (likedAlready) {
        await Like.findByIdAndDelete(likedAlready._id);
        return res.status(200).json(new ApiResponse(200, { tweetId, isLiked: false }));
    }

    await Like.create({
        tweet: tweetId,
        likedBy: user._id,
    });

    return res.status(200).json(new ApiResponse(200, { tweetId, isLiked: true }));
});


const getLikedVideos = asyncHandler(async (req, res) => {
    const  userId  = req.user;

    const likes = await Like.find({ likedBy : userId._id }).populate("video");

    return res.status(200).json(new ApiResponse(200, likes, "Liked videos fetched successfully"));

   
})

export {
    getLikedVideos, toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike
};

