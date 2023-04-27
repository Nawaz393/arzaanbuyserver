const History = require("../Models/History");
const deleteImage = require("../utils/deleteImages");
exports.addtoHistory = async (ad) => {
  const historyAd = {
    userid: ad.userid,
    name: ad.name,
    tagline: ad.tagline,
    description: ad.description,
    detail: ad.detail,
    price: ad.price,
    category: ad.category,
    images: ad.images,
    email: ad.email,
    whatsapp: ad.whatsapp,
    phone: ad.phone,
    address: ad.address,
    website: ad.website,
  };

  try {
    const history = new History(historyAd);
    const savedAd = await history.save();
    if (!savedAd) {
      console.log("error in saving ad to history");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getFromHistory = async (req, res) => {
  const id = req.query.id;
  console.log(id);
  if (!id) {
    return res.status(400).send("invalid  id");
  }

  try {
    const history = await History.find({ userid: id });

    if (!history) {
      return res.status(400).send("no history found");
    }
    console.log(history);
    return res.status(200).send(history);
  } catch (error) {
    console.log(error);
    return res.status(400).send("there is an error in getting history");
  }
};

exports.deleteFromHistory = async (req, res) => {
  const id = req.query.id;

  if (!id || id == "") {
    return res.status(400).send("there is no ad to delete");
  }

  try {
    const deletead = await History.findByIdAndDelete(id);
    if (!deletead) {
      return res
        .status(400)
        .send("there is an error in deleting ad please try again");
    }

    deleteImage(deletead.images);

    return res.status(200).send("your ad is deleted successfully from history");
  } catch (error) {
    return res
      .status(400)
      .send("there is an error in deleting ad please try again");
  }
};
