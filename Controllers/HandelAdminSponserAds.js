const SponserPendingAd = require("../Models/SponserPendingAd");
const SponserApprovedAd = require("../Models/SponserApprovedAd");
const deleteImage = require("../utils/deleteImages");
exports.getAllpendingSponserAds = async (req, res) => {
  try {
    const pendingads = await SponserPendingAd.find();
    if (!pendingads) {
      return res.status(400).json("there is no pending ads");
    }
    return res.status(200).json(pendingads);
  } catch (error) {
    return res.status(400).json("there is an error in getting pending ads");
  }
};
exports.approveSponserAd = async (req, res) => {
  const { id } = req.body.params;

  if (!id) {
    return res.status(400).json("there is no ad to approve");
  }

  try {
    const approvedad = await SponserPendingAd.findById(id);

    if (!approvedad) {
      return res.status(400).json("there is no ad to approve");
    }

    console.log(approvedad);
    const newSponserApprovedAd = new SponserApprovedAd({
      image: approvedad.image,
      userid: approvedad.userid,
      link: approvedad.link,
      location: approvedad.location,
      expireAt: new Date(
        Date.now() + approvedad.days * 24 * 60 * 60 * 1000
      ).getTime(),
    });

    const resp = await newSponserApprovedAd.save();

    if (!resp) {
      console.log("error >> res");
      return res.status(400).json("there is an error in approving ad");
    }

    const deletedad = await SponserPendingAd.findByIdAndDelete(id);

    if (!deletedad) {
      console.log("error >> deletedad");
      return res.status(400).json("there is an error in approving ad");
    }

    return res.status(200).json("ad is approved");
  } catch (error) {
    console.log(error);
    return res.status(400).json("there is an error in approving ad");
  }
};

exports.rejectSponserAd = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json("there is no ad to reject");
  }

  try {
    const rejectedad = await SponserPendingAd.findByIdAndDelete(id);
    if (!rejectedad) {
      return res.status(400).json("there is an error in rejecting ad");
    }
    await deleteImage([rejectedad.image]);

    return res.status(200).json("ad is rejected");
  } catch (error) {
    console.log(error);
    return res.status(400).json("there is an error in rejecting ad");
  }
};

exports.getAllApprovedSponserAds = async (req, res) => {
  try {
    const approvedads = await SponserApprovedAd.find();
    if (!approvedads) {
      return res.status(400).json("there is no approved ads");
    }
    return res.status(200).json(approvedads);
  } catch (error) {
    console.log(error);
    return res.status(400).json("there is an error in getting approved ads");
  }
};
