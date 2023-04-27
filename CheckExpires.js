const cron = require('node-cron');

const ApprovedAd = require('./Models/ApprovedAd');

// Schedule the cron job to run every day at midnight
const CheckBoostedAds= async () => {
  try {
    console.log("job started");
    // Find all boosted ads that have expired
    const now = new Date(Date.now()).getTime();
    const expiredAds = await ApprovedAd.find({
      'boost.boosted': true,
      'boost.to': { $lte: now },
    });

    // Set the boost.boosted field to false for each expired ad
    const updatePromises = expiredAds.map(ad => {
      ad.boost.boosted = false;
      return ad.save();
    });
    await Promise.all(updatePromises);

    console.log(`Updated ${expiredAds.length} expired boosted ads`);
  } catch (error) {
    console.error(error);
  }
}

cron.schedule('*/1 * * * *', CheckBoostedAds);
module.exports = CheckBoostedAds;
