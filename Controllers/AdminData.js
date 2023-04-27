const PendingAd = require("../Models/PendingAd");
const approvedAd = require("../Models/ApprovedAd");
const User = require("../Models/User");
const DeactivatedUsers = require("../Models/DeactivateUsers");
const Adminuser = require("../Models/Adminuser");
const deleteImages = require("../utils/deleteImages");
const bcrypt = require("bcrypt");
const SponserApprovedAd = require("../Models/SponserApprovedAd");
const SponserPendingAd = require("../Models/SponserPendingAd");

// this function is used to approve the pending ads and save it to the database
exports.ApprovedAd = async (req, res) => {
  // Find the ad in the database using the id provided
  const id = req.body.id;
  if (!id || id == "") {
    return res.status(400).send("there is no ad to approve");
  }
  const ad = await PendingAd.findById(id);
  // Check if the ad exists in the database
  if (!ad) {
    return res.status(404).json("Ad not found");
  }

  const newad = {
    tagline: ad.tagline,
    userid: ad.userid,
    name: ad.name,
    description: ad.description,
    detail: ad.detail,
    price: ad.price,
    category: ad.category,
    email: ad.email,
    whatsapp: ad.whatsapp,
    phone: ad.phone,
    address: ad.address,
    website: ad.website,
    images: [...ad.images],
  };

  // Create a new instance of the approvedAd model
  const approved = new approvedAd(newad);
  try {
    // Save the new instance of the approvedAd model to the database
    const savedAd = await approved.save();
    // Check if the ad was saved to the database

    if (!savedAd) {
      return res
        .status(401)
        .json("there is an error in posting ad please try again");
    }

    // Delete the ad from the pendingAd model
    const deletedAd = await PendingAd.findByIdAndDelete(id);
    // Check if the ad was deleted from the pendingAd model
    if (!deletedAd) {
      return res
        .status(401)
        .json("there is an error in approving ad please try again");
    }
    return res.status(200).json(" Ad is approved ");
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json("there is an error in approving ad please try again");
  }
};

exports.getApprovedAds = async (req, res) => {
  try {
    const result = await approvedAd.find();
    if (!result) {
      return res.status(400).send("there is no ads");
    }
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send("there is an error in getting the ads");
  }
};

// this function is used to get the pending ads return it to the admin page
exports.getPendingAds = (req, res) => {
  PendingAd.find()
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json("there is an error in getting ads");
    });
};

exports.getCounts = async (req, res) => {
  const collections = [
    approvedAd,
    PendingAd,
    User,
    DeactivatedUsers,
    SponserApprovedAd,
    SponserPendingAd,
  ];
  try {
    const counts = await Promise.all(
      collections.map(async (collection) => ({
        name: collection.collection.name,
        count: await collection.countDocuments(),
      }))
    );
    console.log(counts);
    return res.status(200).json(counts);
  } catch (error) {
    console.log(error);
    return res.status(400).json("there is an error in getting counts");
  }
};

exports.addAdminUser = async (req, res) => {
  console.log(req.body);
  const { email, name, password, confirmPassword } = req.body;
  if (!email || !name || !password || !confirmPassword) {
    return res.status(400).json("please fill all the fields");
  }
  if (password !== confirmPassword) {
    return res.status(400).json("passwords do not match");
  }
  const hash = await bcrypt.hash(password, 10);
  const newAdmin = new Adminuser({
    email,
    name,
    password: hash,
  });

  try {
    const savedAdmin = await newAdmin.save();

    if (!savedAdmin) {
      return res.status(400).json("there is an error in adding admin");
    }

    return res.status(200).json("new admin added successfully");
  } catch (error) {
    console.log(error);
    return res.status(400).json("there is an error in adding admin");
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -__v  -bio");
    if (!users) {
      return res.status(400).json("there is an error in getting users");
    }
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json("there is an error in getting users");
  }
};

exports.deactivateUser = async (req, res) => {
  console.log(req.body);
  const { id } = req.body;

  if (!id) {
    return res.status(400).json("there is no user to deactivate");
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json("there is no user to deactivate");
    }

    const newDeactivatedUser = new DeactivatedUsers({
      name: user.name,
      email: user.email,
      bio: user.bio,
      phone: user.phone,
      address: user.address,
      image: user.image,
      role: user.role,
      password: user.password,
    });

    const savedDeactivatedUser = await newDeactivatedUser.save();

    if (!savedDeactivatedUser) {
      return res.status(400).json("there is an error in deactivating user");
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(400).json("there is an error in deactivating user");
    }
    return res.status(200).json("user deactivated successfully");
  } catch (error) {
    console.log(error);
    return res.status(400).json("there is an error in deactivating user");
  }
};

exports.deleteuser = async (req, res) => {
  if (!req.body.id) {
    return res.status(400).json("there is no user to delete");
  }

  try {
    const deleteduser = await User.findByIdAndDelete(req.body.id);
    if (!deleteduser) {
      return res.status(400).json("there is no user to delete");
    }
    return res.status(200).json("user deleted successfully");
  } catch (error) {
    console.log(error);
    return res.status(400).json("there is an error in deleting user");
  }
};

exports.getDeactivatedUsers = async (req, res) => {
  console.log("get deactivated users");
  try {
    const deactivatedUsers = await DeactivatedUsers.find().select(
      "-password -__v -bio"
    );
    if (!deactivatedUsers) {
      return res
        .status(400)
        .json("there is an error in getting deactivated users");
    }
    return res.status(200).json(deactivatedUsers);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json("there is an error in getting deactivated users");
  }
};

exports.activateUser = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json("there is no user to activate");
  }

  try {
    const user = await DeactivatedUsers.findById(id);
    if (!user) {
      return res.status(400).json("there is no user to activate");
    }

    const newUser = new User({
      name: user.name,
      email: user.email,
      bio: user.bio,
      phone: user.phone,
      address: user.address,
      image: user.image,
      role: user.role,
      password: user.password,
    });

    const savedUser = await newUser.save();

    if (!savedUser) {
      return res.status(400).json("there is an error in activating user");
    }

    const deletedUser = await DeactivatedUsers.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(400).json("there is an error in activating user");
    }
    return res.status(200).json("user activated successfully");
  } catch (error) {
    console.log(error);
    return res.status(400).json("there is an error in activating user");
  }
};

exports.rejectAd = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json("there is no ad to reject");
  }

  try {
    const rejectedad = await PendingAd.findByIdAndDelete(id);

    if (!rejectedad) {
      return res.status(400).json("there is an error in rejecting ad");
    }

    await deleteImages(rejectedad.images);
    return res.status(200).json("ad is rejected");
  } catch (error) {
    console.log(error);
    return res.status(400).json("there is an error in rejecting ad");
  }
};
