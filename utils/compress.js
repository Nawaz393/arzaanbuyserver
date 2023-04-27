const sharp = require("sharp");
async function Compress(inputBase64) {
  try {
    const split = inputBase64.split(",");
    const inputBuffer = Buffer.from(split[1], "base64");
    const type = split[0].split("/")[1].split(";")[0];
    console.log(split[0]);
    console.log(type);
    const outputBuffer = await sharp(inputBuffer)
      .toFormat(type,{ quality: 50 })
      .toBuffer();
    const outputBase64 = `${split[0]},${outputBuffer.toString("base64")}`;
    return outputBase64;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = Compress;
