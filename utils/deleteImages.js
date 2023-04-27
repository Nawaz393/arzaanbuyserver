const cloudinary = require("./cloudinary");

// delete images from cloudinary
const deleteImage = async (imagesurl) => {
  // Loop through each image in the array
  for (let url of imagesurl) {
    try {
      // Extract the image id from the image url
      const items = url.split("/");
      const folder = items[items.length - 2];
      const imageid = items.pop().split(".")[0];
      const public_id = folder + "/" + imageid;

      // Delete the image from cloudinary
      const result = await cloudinary.uploader.destroy(public_id);
      console.log(result);
    } catch (error) {
     throw new Error(error);
    }
  }
};

module.exports = deleteImage;
