const User = require("../Models/User");
const profileSchema = require("../utils/ValidationSchema/profileValidator");
const cloudinary = require("../utils/cloudinary");
const bcrypt = require("bcrypt");
exports.getuserdashboard = async (req, res) => {
  console.log(req.query);
  const id = req.query.id;

  if (!id) {
    return res.status(400).send("user not found");
  }

  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(400).send("user not found");
    }
    console.log(user);
    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(400).send("there is an error in getting user");
  }
};

exports.uploaduserimage = async (req, res) => {
  const { imageUpload, id } = req.body;

  console.log(req.body);

  if (!imageUpload) {
    return res.status(400).send("image is required");
  }

  try {
    const result = await cloudinary.uploader.upload(imageUpload, {
      folder: "profiles",
    });

    console.log(result);
    if (!result) {
      return res.status(400).send("there is an error in uploading image");
    }

    const upload = await User.findByIdAndUpdate(id, {
      image: result.secure_url,
    });

    console.log(upload);
    if (!upload) {
      return res.status(400).send("there is an error in uploading image");
    }

    return res.status(200).send("image is uploaded successfully");
  } catch (error) {
    console.log(error);
    return res.status(400).send("there is an error in uploading image");
  }
};

exports.updateuser = async (req, res) => {
  const { id, name, phone, address, bio } = req.body;

  console.log(req.body);

  const data = {
    name: name,
    phone: phone,
    address: address,
    bio: bio,
  };

  const { value, error } = profileSchema.validate(data, { abortEarly: false });

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    // const resp =await User.findOneAndReplace({_id:id},data)

    const resp = await User.findByIdAndUpdate(id, {
      name: name,
      phone: phone,
      address: address,
      bio: bio,
    });

    if (!resp) {
      return res.status(400).send("there is an error in updating profile");
    }

    return res.status(200).send("profile is updated successfully");
  } catch (error) {
    console.log(error);
    return res.status(400).send("there is an error in updating profile");
  }
};

exports.updatePassword = async (req, res) => {
  if (!req.body.password || !req.body.cpassword) {
    return res.status(400).send("password and confirm password is required");
  }

  if (req.body.password != req.body.cpassword) {
    return res.status(400).send("password and confirm password must be same");
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  const user = await User.findByIdAndUpdate(req.body.id, {
    password: hashPassword,
  });
  if (!user) {
    return res.status(400).send("there is an error in updating password");
  }

  return res.status(200).send("password is updated successfully");
};
