import jwt from "jsonwebtoken";
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiErrors.js';
import { ApiResponse } from '../utils/ApiResponce.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAcessAndRefreshtoken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAcessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, 'Something went wrong while generating refresh and access token');
  }
};

const registeruser = asyncHandler(async (req, res, next) => {
  const { fullName, email, username, password, avatar } = req.body;

  // Validate required fields
  if ([fullName, email, username, password].some(field => !field || field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  if (!email.includes('@')) {
    throw new ApiError(400, "Invalid email format");
  }

  // Check if the user already exists
  const existedUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existedUser) {
    throw new ApiError(409, "Email or username already exists");
  }

  // Normalize username
  const normalizedUsername = username.toLowerCase();

  // Initialize local paths and URLs
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
  let avatarUrl = avatar;
  const coverImageUrl = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : "";

  // Handle avatar image
  if (!avatarUrl && !avatarLocalPath) {
    throw new ApiError(400, "Please provide an avatar image");
  }

  // Upload avatar to Cloudinary if a local file is provided
  
if (avatarLocalPath) {
  avatarUrl = await uploadOnCloudinary(avatarLocalPath);
  if (!avatarUrl) {
    throw new ApiError(500, "Error uploading avatar image");
  }
}

  // Create the user
  const user = await User.create({
    fullName,
    email,
    username: normalizedUsername,
    password,
    avatar: avatarUrl,
    coverImage: coverImageUrl,
  });

  // Retrieve the created user without sensitive fields
  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "User creation failed");
  }

  // Generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAcessAndRefreshtoken(user._id);

  // Respond with success
  return res.status(201).json(new ApiResponse(200, { user: createdUser, accessToken, refreshToken }, "User registered successfully"));
});



const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Please provide a username or email");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }]
  });

  // Fixed typo: `userd` -> `user`
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect password");
  }

  const { accessToken, refreshToken } = await generateAcessAndRefreshtoken(user._id);

  const loggedinUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true
  };

  res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        user: loggedinUser,
        accessToken,
        refreshToken
      }, "Logged in successfully")
    );
});

const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $unset: {
    refreshToken: 1
  } }, { new: true });

  const options = {
    httpOnly: true,
    secure: true
  };

  return res.status(200).clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const refreshAcessTOken = asyncHandler (async (req,res) =>{
  const incomingrefreshTOken=  req.cookie.refreshToken || req.body

  if(!incomingrefreshTOken){
    throw new ApiError(401, "Unauthorized request")
  }

  // verify the incoming token 
 try {
    const decododToken = await  jwt.verify(incomingrefreshTOken , process.env.REFRESH_TOKEN_SECRET)
   
     // find the user from the id
     const user=  User.findById(decododToken?._id)
     if(!user){
       throw new ApiError(401, "Invalid refreah token")
     }
   
     //mathc incoming refeah and decodec
     if(incomingrefreshTOken !== user?.refreshToken){
       throw new ApiError(401, "redresh token is expired or used")
     }
   
   const options = {
       httpOnly: true,
       secure: true
     };
   
   
     // generate new access token
      const {accessToken, refreshToken}= await generateAcessAndRefreshtoken(user._id)
   
       return res.status(200)
       .cookie("accesToken", accessToken,options)
       .cookie("refreshToken",newrefreshToken=refreshToken, options )
       .json(
           new ApiResponse(200, {accessToken, newrefreshToken}, "access token refreshed")
       )
 } catch (error) {
    new ApiError(401,error?.message || "Invalid refreah token")
    
 }



});

const changeCurrentPassowrd = asyncHandler(async (req,res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword ||!newPassword) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Incorrect old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  const updatedUser = await User.findById(user._id).select("-password -refreshToken");

  return res.status(200).json(
    new ApiResponse(200, updatedUser, "Password changed successfully")
  );
})

const getCureentUser = asyncHandler(async (req,res) => {
  return res.status(200)
  .json(new ApiResponse(200,req.user, "current user frcthced succesfully"))

})

const updateAccountDetails = asyncHandler(async(req,res) => {
  const { fullName, email, username,  } = req.body


  const user = await User.findByIdAndUpdate(req.user?._id, {
   $set  :{
    fullName,
    email,
    username: username? username.toLowerCase() : "",
   }
   
  }, { new: true }).select("-password")


  if (!user) {
    throw new ApiError(404, "User not found");
  }


  return res.status(200).json(
    new ApiResponse(200, user, "Account details updated successfully")
  )
}
)

const updateuserAvatar = asyncHandler(async(req,res) => {
  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Please provide an avatar image");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(500, "error while uploadin in avatar");
  }

  const user = await User.findByIdAndUpdate(req.user?._id, { $set :{avatar: avatar.url }}, { new: true }).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(200, user, "User avatar updated successfully")
  );

}) 
const updateuserCoverImage = asyncHandler(async(req,res) => {
  const coverImageLocalPath = req.files?.path;

  if (!coverImageLocalPathh) {
    throw new ApiError(400, "Please provide an coverimage image");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(500, "error while uploadin in coverimage");
  }

  const user = await User.findByIdAndUpdate(req.user?._id, { $set :{coverImage: coverImage.url }}, { new: true }).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(200, user, "User coverImage updated successfully")
  );

})

const getUserChannelProfile = asyncHandler(async(req, res) => {
  const {username} = req.params

  if (!username?.trim()) {
      throw new ApiError(400, "username is missing")
  }

  const channel = await User.aggregate([
      {
          $match: {
              username: username?.toLowerCase()
          }
      },
      {
          $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "channel",
              as: "subscribers"
          }
      },
      {
          $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "subscriber",
              as: "subscribedTo"
          }
      },
      {
          $addFields: {
              subscribersCount: {
                  $size: "$subscribers"
              },
              channelsSubscribedToCount: {
                  $size: "$subscribedTo"
              },
              isSubscribed: {
                  $cond: {
                      if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                      then: true,
                      else: false
                  }
              }
          }
      },
      {
          $project: {
              fullName: 1,
              username: 1,
              subscribersCount: 1,
              channelsSubscribedToCount: 1,
              isSubscribed: 1,
              avatar: 1,
              coverImage: 1,
              email: 1

          }
      }
  ])

  if (!channel?.length) {
      throw new ApiError(404, "channel does not exists")
  }

  return res
  .status(200)
  .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully")
  )
})

const getWatchHistory = asyncHandler(async(req, res) => {
  const user = await User.aggregate([
      {
          $match: {
              _id: new mongoose.Types.ObjectId(req.user._id)
          }
      },
      {
          $lookup: {
              from: "videos",
              localField: "watchHistory",
              foreignField: "_id",
              as: "watchHistory",
              pipeline: [
                  {
                      $lookup: {
                          from: "users",
                          localField: "owner",
                          foreignField: "_id",
                          as: "owner",
                          pipeline: [
                              {
                                  $project: {
                                      fullName: 1,
                                      username: 1,
                                      avatar: 1
                                  }
                              }
                          ]
                      }
                  },
                  {
                      $addFields:{
                          owner:{
                              $first: "$owner"
                          }
                      }
                  }
              ]
          }
      }
  ])

  return res
  .status(200)
  .json(
      new ApiResponse(
          200,
          user[0].watchHistory,
          "Watch history fetched successfully"
      )
  )
})




export { changeCurrentPassowrd, getCureentUser, getUserChannelProfile, getWatchHistory, loginUser, logOutUser, refreshAcessTOken, registeruser, updateAccountDetails, updateuserAvatar, updateuserCoverImage };

