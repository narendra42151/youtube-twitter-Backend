
import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";



const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    console.log(userId);
    const pipeline = [];

    
    if (query) {
        pipeline.push({
            $search: {
                index: "search-videos",
                text: {
                    query: query,
                    path: ["title", "description"] //search only on title, desc
                }
            }
        });
    }

    if (userId) {
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid userId");
        }

        pipeline.push({
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        });
    }

    // fetch videos only that are set isPublished as true
    pipeline.push({ $match: { isPublished: true } });

    //sortBy can be views, createdAt, duration
    //sortType can be ascending(-1) or descending(1)
    if (sortBy && sortType) {
        pipeline.push({
            $sort: {
                [sortBy]: sortType === "asc" ? 1 : -1
            }
        });
    } else {
        pipeline.push({ $sort: { createdAt: -1 } });
    }

    pipeline.push(
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            "avatar.url": 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$ownerDetails"
        }
    )

    const videoAggregate = Video.aggregate(pipeline);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    };

    const video = await Video.aggregatePaginate(videoAggregate, options);

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Videos fetched successfully"));
});

const publishAVideo =asyncHandler(async (req, res) => {
    const {title,description} = req.body;
    const userId= req.user;

    if(!userId) throw new ApiError (400,"Cannot recognise user")

        if(!title || !description) {
            throw new ApiError(400, "All fields are required")
        }

        const videoFilePath = req.files?.videoFile[0]?.path;
        const thumbnailPath= req.files?.thumbnail[0]?.path;

        if(!videoFilePath ||!thumbnailPath) {
            throw new ApiError(400, "Please provide video file and thumbnail")
        }

        const videoFile=await uploadOnCloudinary(videoFilePath);
        const thumbnailUrl = await uploadOnCloudinary(thumbnailPath);

         const result = await Video.create({
           tittle: title,
            description,
            owner: userId._id,
            videoFile: videoFile?.url,
            thumbnail: thumbnailUrl?.url,
            isPublished: true,
            duration : videoFile.duration
         })

         return res.status(200).json(new ApiResponse(200, {result}, "Video uplished succesfully"))


})

const getVideoById = asyncHandler(async (req,res)=>  {
    const { videoId}  = req.params;
    if(!videoId) {
        throw new ApiError(400, "Invalid videoId")
    }
    const video = await Video.findById(videoId).populate('owner', 'username avatar');
    if(!video) throw new ApiError(400, "video not found");

    return res.status(200).json(new ApiResponse(200,{video}, " video found succesfully "))

})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!videoId) {
        throw new ApiError(400, "Invalid videoId");
    }

    if (!title && !description && !req.file) {
        throw new ApiError(400, "No data provided to update video");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;

    if (req.file) {
        const thumbnailPath = req.file.path;
        try {
            const thumbnailNew = await uploadOnCloudinary(thumbnailPath);
            if (thumbnailNew?.path) {
                updateData.thumbnail = thumbnailNew.path;
            } else {
                console.warn("Cloudinary upload succeeded but did not return a path");
            }
        } catch (error) {
            console.error("Error uploading to Cloudinary:", error);
            throw new ApiError(500, "Error uploading thumbnail");
        }
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $set: updateData },
        { new: true }
    );

    if (!updatedVideo) {
        throw new ApiError(500, "Failed to update video");
    }

    return res.status(200).json(
        new ApiResponse(200, { updatedVideo }, "Video updated successfully")
    );
});

const deleteVideo = asyncHandler(async (req,res) => {
    const {videoId}= req.params;
    if(!videoId) {
        throw new ApiError(400, "Invalid videoId")
    }


    const videodel= await Video.findById(videoId);
     
    const video = await Video.findByIdAndDelete(videoId);
    if(!video) throw new ApiError(400, "Video not found");


    return res.status(200).json( new ApiResponse(400 ,{video} , " deletion completed"))

   

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) {
      throw new ApiError(400, "VideoId Field empty");
    }
    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "No Such Video");
    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      {
        $set: {
          isPublished: !video.isPublished,
        },
      },
      { new: true }
    );
    if (!updatedVideo) throw new ApiError(400, "Failed to update video");
  
    return res
      .status(200)
      .json(new ApiResponse(200, { updatedVideo }, "publish status toggled"));
  });
  

  export {
    deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo
};
