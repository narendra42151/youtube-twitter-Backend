import mongoose from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
    const { tweet } = req.body
    if(!tweet) throw new ApiError(400, "Please provide a tweet text");
    const user= req.user;
    if(!user) throw new ApiError(401, "You are not authenticated");

    const tweetnew = await Tweet.create({ content :tweet, owner:user._id })
    if(!tweetnew) throw new ApiError(400, "Error in creating tweet");

   

    return res.status(200).json(new ApiResponse(200,{tweetnew} , " tweet created succesfully"))


})

const getUserTweets = asyncHandler(async (req, res) => {

    const user= req.user;
    if(!user) throw new ApiError(401, "You are not authenticated");
const tweet = await Tweet.find({owner: new mongoose.Types.ObjectId(user._id)});
    if(!tweet) throw new ApiError(400, "User tweets not found");

const tweetsagg = await Tweet.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(user._id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "usertweets",
      },
    },
    {
      $unwind: "$usertweets",
    },
    {
      $group: {
        _id: null,
        content: { $push: "$tweet" },
        User: { $first: "$usertweets" },
      },
    },
    {
      $project: {
        _id: 0,
        content: 1,
        User: {
          fullName: 1,
          avatar: 1,
          email: 1,
          username: 1,
        },
      },
    },
  ]);

return res.status(200).json(new ApiResponse(200, {tweet},"get user tweets"));

    
})

const updateTweet = asyncHandler(async (req, res) => {

    const user= req.user;
    if(!user) throw new ApiError(401, "You are not authenticated");
    const { tweetId } = req.params;
    const { text } = req.body;
    if(!tweetId) throw new ApiError(400, "Please provide tweet id");
    if(!text) throw new ApiError(400, "Please provide tweet text");

    const findTweet = await Tweet.findById(tweetId);

    if(!findTweet) throw new ApiError(400, "tweet not found");
    if(String(findTweet.owner)!== String(user._id)) throw new ApiError(401, "you are not authorized to update this tweet");



    const updatetweet = await Tweet.findByIdAndUpdate(
        tweetId,
        { content: text },
        { new: true }
    )
    
    return res.status(200).json(new ApiResponse(200, {updatetweet},"update tweet"));
})

const deleteTweet = asyncHandler(async (req, res) => {

    const user= req.user;
    if(!user) throw new ApiError(401, "You are not authenticated");
    const { tweetId } = req.params;
    if(!tweetId) throw new ApiError(400, "Please provide tweet id");

    const findTweet = await Tweet.findById(tweetId);
    if(!findTweet) throw new ApiError(400, "tweet not found");
    if(String(findTweet.owner)!== String(user._id)) throw new ApiError(401, "you are not authorized to delete this tweet");
  const deleteTweet=  await Tweet.findByIdAndDelete(tweetId);
    return res.status(200).json(new ApiResponse(200,{deleteTweet} , "tweet deleted"))
}
)

export {
    createTweet, deleteTweet, getUserTweets,
    updateTweet
};

