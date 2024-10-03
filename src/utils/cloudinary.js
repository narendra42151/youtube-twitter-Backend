import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({ 
    cloud_name: 'dpgr794sd', 
    api_key: '889866112822469', 
    api_secret: 'CqCXlAoHnAg0pnQo9b97CNVU1Xk'
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        console.log("File uploaded on Cloudinary:", response.url);

        // Remove the locally saved temporary file
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
            console.log("Local file removed:", localFilePath);
        } else {
            console.warn("File not found, skipping unlink:", localFilePath);
        }

        return response;

    } catch (error) {
        console.error("Error in uploadOnCloudinary:", error);

        // Attempt to remove the locally saved file even if upload failed
        if (fs.existsSync(localFilePath)) {
            try {
                fs.unlinkSync(localFilePath);
                console.log("Local file removed after upload failure:", localFilePath);
            } catch (unlinkError) {
                console.error("Error removing local file:", unlinkError);
            }
        }

        return null;
    }
};

export { uploadOnCloudinary };
