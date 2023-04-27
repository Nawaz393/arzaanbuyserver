const approvedAd = require("../Models/ApprovedAd");
exports.getApprovedAd = async (req, res) => {
  // get the approved ads from the database
  try {
    const ads = await approvedAd
      .find()
      .sort({ "boost.boosted": -1 })
      .limit(150);
    if (!ads) {
      return res.status(404).json("No ads found");
    }
    // return the ads to the client
    return res.status(200).json(ads);
  } catch (error) {
    return res.status(500).json("There was an error getting the ads");
  }
};

exports.getByCategory = async (req, res) => {
  console.log("getting by category");
  console.log(req.query);
  const catagory = req.query.category;

  if (catagory === "" || catagory === undefined) {
    res.status(400).send("please provide a category");
    return;
  }
  try {
    const result = await approvedAd
      .find({ category: catagory })
      .sort({ "boost.boosted": -1 });
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send("there is an error in getting the ads");
  }
};

exports.getsingleProduct = async (req, res) => {
  console.log(req.query);
  const id = req.query.id;

  if (!id) {
    return res.status(400).send("please provide a product id");
  }

  try {
    const result = await approvedAd.findById(id);
    if (!result) {
      return res.status(404).send("no product found");
    }
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send("there is an error in getting the product");
  }
};

exports.searchByNames = async (req, res) => {
  console.log("searching");
  const name = req.query.name;
  console.log(req.query);

  if (!name) {
    return res.status(400).send("please provide a name");
  }

  try {
    const regex = new RegExp(name, "i");
    const result = await approvedAd
      .find({ name: { $regex: regex } })
      .sort({ "boost.boosted": -1 });
    if (!result) {
      return res.status(404).send("no product found");
    }
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send("there is an error in getting the product");
  }
};
