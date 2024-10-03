import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get all comments for a video
const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    console.log(req.query);
    const offset = (Number(page) - 1) * Number(limit);
    const comments = await Comment.aggregate([
      {
        $match: {
          video: new mongoose.Types.ObjectId(videoId),
        },
      },
      {
        $project: {
          content: 1,
          video: 1,
          owner: 1,
        },
      },
      {
        $skip: Number(offset),
      },
      {
        $limit: Number(limit),
      },
    ]);
    if (!comments) throw new ApiError(400, "No comments on this video");
  
    return res
      .status(200)
      .json(new ApiResponse(200, { comments }, "Comments fetched successfully"));
  });
  
  const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params;
    const { content } = req.body;
    const user = req.user;
    if (!videoId) throw new ApiError(400, "Cant read videoid");
    const comment = await Comment.create({
      content,
      video: videoId,
      owner: user._id,
    });
    if (!comment) throw new ApiError(400, "Error in adding comment");
    return res
      .status(200)
      .json(new ApiResponse(200, { comment }, "Comment added successfully"));
  });
  
  const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params;
    if (!commentId) throw new ApiError(400, "Cant read commentid");
  
    const user = req.user;
    const { content } = req.body;
    const comment = await Comment.findById(commentId);
    if (!comment) throw new ApiError(400, "no such comment");
    const update = await Comment.findByIdAndUpdate(
      commentId,
      {
        content: content,
      },
      { new: true }
    );
    if (!update) throw new ApiError(400, "error in updating comment");
    return res
      .status(200)
      .json(new ApiResponse(200, { update }, "Comment updated"));
  });
  
  const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params;
    if (!commentId) throw new ApiError(400, "Cant read commentid");
  
    const user = req.user;
    //   const { content } = req.body;
    const comment = await Comment.findById(commentId);
    if (!comment) throw new ApiError(400, "no such comment");
    const update = await Comment.findByIdAndDelete(commentId);
    if (!update) throw new ApiError(400, "error in updating comment");
    return res
      .status(200)
      .json(new ApiResponse(200, { update }, "Comment deleted"));
  });
  
  export { addComment, deleteComment, getVideoComments, updateComment };
