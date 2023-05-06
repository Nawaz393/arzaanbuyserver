const cloudinary = require("../utils/cloudinary");
const adSchema = require("../utils/ValidationSchema/adValidator");
const deleteImage = require("../utils/deleteImages");
const approvedAd = require("../Models/ApprovedAd");
const PendingAd = require("../Models/PendingAd");
const { addtoHistory } = require("./Historyhandler");
const Compress = require("../utils/compress");
const joi = require("joi");
const History = require("../Models/History");

exports.getUserApprovedAds = async (req, res) => {
  const { userid } = req.query;

  console.log(req.query);
  console.log(userid);
  if (!userid) {
    return res.status(400).json("there is no user to get ads");
  }

  try {
    const approvedads = await approvedAd.find({ userid: userid });
    if (!approvedads) {
      return res.status(400).json(" no Listed ads found");
    }
    return res.status(200).json(approvedads);
  } catch (error) {
    console.log(error);
    return res.status(400).json("there is an error in getting Listed ads");
  }
};

exports.updateApprovedAd = async (req, res) => {
  const data = {
    tagline: req.body.tagline,
    description: req.body.description,
    email: req.body.email,
    phone: req.body.phone,
    website: req.body.website,
  };

  console.log(" id is >>>>", req.body.id);
  // console.log(data);
  console.log(req.body);

  const schema = joi.object().keys({
    tagline: joi.string().min(5).required(),
    description: joi.string().min(15).required(),
    email: joi.string().email().required(),
    phone: joi.required(),
    website: joi.string().required(),
  });

  const { error, value } = schema.validate(data, { abortEarly: false });

  if (error) {
    return res.status(400).json(error.details[0].message);
  }

  try {
    const update = await approvedAd.findById(req.body.id);

    const pending = new PendingAd({
      tagline: value.tagline,
      description: value.description,
      email: value.email,
      phone: value.phone,
      website: value.website,
      userid: update.userid,
      images: update.images,
      category: update.category,
      whatsapp: update.whatsapp,
      address: update.address,
      price: update.price,
      name: update.name,
      detail: update.detail,
      boost: update.boost,
    });

    const save = await pending.save();
    console.log("save>>>>>>>>>>>>>>>>>>>>>");
    console.log("save>>>>>>>>>>>>>>>>>>>>>", save);
    if (!save) {
      return res.status(400).send("there is an error in updating the ad");
    }

    const deletefromApproved = await approvedAd.findByIdAndDelete(req.body.id);
    console.log("deletefromApproved>>>>>>>>>>>>>>>>>>>>>", deletefromApproved);
    return res.status(200).send("your ad is updated successfully");
  } catch (error) {
    console.log(error);
    return res.status(400).send("there is an error in updating the ad");
  }
};

exports.deleteApprovedAd = async (req, res) => {
  const id = req.query.id;
  if (!id || id == "") {
    return res.status(400).send("there is no ad to delete");
  }

  try {
    const deletedAd = await approvedAd.findByIdAndDelete(id);

    if (!deletedAd) {
      console.log(" deleted ad error");
      return res
        .status(401)
        .send("there is an error in deleting ad please try again");
    }

    addtoHistory(deletedAd);

    return res.status(200).send("your ad is deleted successfully");
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send("there is an error in deleting ad please try again");
  }
};

//----------------------------------pendingAd--------------------------------------------
exports.getUserPendingAds = async (req, res) => {
  const userid = req.query.id;
  console.log(userid);
  if (!userid) {
    return res.status(400).send("there is no user id");
  }

  try {
    const pendingAds = await PendingAd.find({ userid: userid });

    console.log(pendingAds);
    if (!pendingAds) {
      return res.status(400).send("there is no pending ads");
    }
    return res.status(200).json(pendingAds);
  } catch (error) {
    console.log(error);
    return res.status(400).send("there is an error in getting pending ads");
  }
};

// this function takes  base 64 images   upload  to cloudinary
// and return the url of the images
const uploadImages = async (files) => {
  const images = [];
  for (let i = 0; i < files.length; i++) {
    try {
      const result = await cloudinary.uploader.upload(files[i], {
        folder: "arzaanbuy",
      });
      console.log(result);
      console.log(result.public_id);
      images.push(result.secure_url);
    } catch (error) {
      console.log(error);
    }
  }
  return images;
};

exports.PostAd = async (req, res) => {
  const data = req.body;
  const images = data.images;
console.log(data)
  // take the images from the body and delete it
  delete data.images;
  console.log(data);

  const role = data.role;
  delete data.role;
  // validate the data  of use form with joi schema
  const { error, value } = adSchema.validate(data, { abortEarly: false });
  if (error) {
    console.log(error.details[0].message);
    return res.status(400).send(error.details[0].message);
  }

  //check valid role

  if (role !== 1100 && role !== 7777) {
    return res.status(400).send("invalid user ");
  }
  //check if user has more than 2 ads already
  if (role === 1100) {
    try {
      const pads = await PendingAd.countDocuments({ userid: data.userid });

      console.log(pads);
      if (pads >= 2) {
        console.log("You can't post more than 2 ads");
        return res.status(400).send("You can't post more than 2 ads ");
      }

      const aads = await approvedAd.countDocuments({ userid: data.userid });

      if (aads >= 2) {
        return res.status(400).send("You can't post more than 2 ads ");
      }
      if (aads + pads >= 2) {
        return res.status(400).send("You can't post more than 2 ads ");
      }
    } catch (error) {
      return res.status(400).send("There is an error in posting your ad");
    }
  }

  // check if the user upload 4 images
  if (images.length < 4 || images.length > 4) {
    console.log("Please upload  4 images");
    return res.status(400).send("Please upload 4 images");
  }

  // check if the user upload images less than 10MB
  let size;
  for (let image of images) {
    const base64String = image;
    const buffer = Buffer.from(base64String, "base64");
    const sizeInBytes = buffer.byteLength;
    const sizeInMB = sizeInBytes / (1024 * 1024);
    size += sizeInMB.toFixed(2);
  }

  if (size > 10) {
    console.log("Please upload images less than 10MB");
    return res.status(400).send("Please upload images less than 10MB");
  }

  let compressimages = [];

  for (let image of images) {
    try {
      const compressimage = await Compress(image);
      compressimages.push(compressimage);
    } catch (error) {
      console.log(error);
      return res.status(400).send("there is an error in compressing please retry");
    }
    // compressimages.push();
  }

  // upload images to cloudinary and get the url of the images



  const imagesurl = await uploadImages(compressimages);

  // check if there is an error in uploading images
  if (!imagesurl) {
    console.log("there is an error in uploading images please try again");
    return res
      .status(401)
      .send("there is an error in uploading images please try again");
  }

  // add the images url to the value object
  value.images = imagesurl;

  // save the data in the database
  const pendingAd = new PendingAd(value);

  try {
    const savedAd = await pendingAd.save();

    if (!savedAd) {
      console.log("there is an error in posting ad please try again");
      return res
        .status(401)
        .send("there is an error in posting ad please try again");
    }

    return res
      .status(200)
      .send("your Ad is posted successfully please wait for admin approval");
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send("there is an error in posting ad please try again");
  }
};

exports.deletependingAd = async (req, res) => {
  //get id from params
  const id = req.body.id;

  if (!id || id == "") {
    res.status(400).send("there is no ad to delete");
  }
  console.log(id);
  try {
    const deletedAd = await PendingAd.findByIdAndDelete(id);
    if (!deletedAd) {
      return res
        .status(401)
        .send("there is an error in deleting ad please try again");
    }

    const imagesurl = deletedAd.images;

    await deleteImage(imagesurl);
    return res.status(200).send("your  is deleted successfully");
  } catch (error) {
    return res
      .status(500)
      .send("there is an error in deleting ad please try again");
  }
};
