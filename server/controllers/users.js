const CryptoJS = require("crypto-js");
const modal = require("../models");

process.env.MY_SECRET_KEY = "secretkeyCryptoJS12345";

const addData = async (req, res) => {
  try {
    const { firstName, lastName, email, gender } = await req.body;
    const { image } = await req;
    console.log("image: ", image);
    if (firstName && lastName && email && gender && image) {
      try {
        const encryptedFirstName = CryptoJS.AES.encrypt(
          firstName,
          process.env.MY_SECRET_KEY
        ).toString();
        const encryptedLastName = CryptoJS.AES.encrypt(
          lastName,
          process.env.MY_SECRET_KEY
        ).toString();
        const encryptedEmail = CryptoJS.AES.encrypt(
          email,
          process.env.MY_SECRET_KEY
        ).toString();
        const encryptedGender = CryptoJS.AES.encrypt(
          gender,
          process.env.MY_SECRET_KEY
        ).toString();
        const encryptedImage = CryptoJS.AES.encrypt(
          image,
          process.env.MY_SECRET_KEY
        ).toString();

        const user = await modal.User.create({
          firstName: encryptedFirstName,
          lastName: encryptedLastName,
          email: encryptedEmail,
          gender: encryptedGender,
          image: encryptedImage,
        });
        return res.status(201).json({ user });
      } catch (err) {
        console.log("err adding data from form: ", err);
        return res.status(400).json(err);
      }
    } else {
      return res.status(406).json({
        msg: "First Name or Last Name or Email or Gender or Image is empty",
      });
    }
  } catch (err) {
    return res.status(400).json(err);
  }
};

const showData = async (req, res) => {
  try {
    const { id } = await req.params;
    const user = await modal.User.findOne({ where: { id } });

    const emailBytes = CryptoJS.AES.decrypt(
      user.email,
      process.env.MY_SECRET_KEY
    );
    const decryptedEmail = emailBytes.toString(CryptoJS.enc.Utf8);

    const firstNameBytes = CryptoJS.AES.decrypt(
      user.firstName,
      process.env.MY_SECRET_KEY
    );
    const decryptedFirstName = firstNameBytes.toString(CryptoJS.enc.Utf8);

    const lastNameBytes = CryptoJS.AES.decrypt(
      user.lastName,
      process.env.MY_SECRET_KEY
    );
    const decryptedLastName = lastNameBytes.toString(CryptoJS.enc.Utf8);

    const genderBytes = CryptoJS.AES.decrypt(
      user.gender,
      process.env.MY_SECRET_KEY
    );
    const decryptedGender = genderBytes.toString(CryptoJS.enc.Utf8);

    const imageBytes = CryptoJS.AES.decrypt(
      user.image,
      process.env.MY_SECRET_KEY
    );
    const decryptedImage = imageBytes.toString(CryptoJS.enc.Utf8);

    process.env.MY_PATH = decryptedImage;
    const imagePath = process.env.MY_PATH;

    return res.status(200).json({
      msg: "SUCCESSFUL",
      decryptedEmail,
      decryptedFirstName,
      decryptedLastName,
      decryptedGender,
      imagePath,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const updateData = async (req, res) => {
  try {
    const { id } = await req.params;
    const { firstName, lastName, email, gender } = await req.body;
    const { image } = await req;

    if (firstName && lastName && email && gender) {
      const encryptedFirstName = CryptoJS.AES.encrypt(
        firstName,
        process.env.MY_SECRET_KEY
      ).toString();
      const encryptedLastName = CryptoJS.AES.encrypt(
        lastName,
        process.env.MY_SECRET_KEY
      ).toString();
      const encryptedEmail = CryptoJS.AES.encrypt(
        email,
        process.env.MY_SECRET_KEY
      ).toString();
      const encryptedGender = CryptoJS.AES.encrypt(
        gender,
        process.env.MY_SECRET_KEY
      ).toString();

      const user = await modal.User.findOne({ where: { id } });

      if (!image) {
        await user.update({
          firstName: encryptedFirstName,
          lastName: encryptedLastName,
          email: encryptedEmail,
          gender: encryptedGender,
          image: user.image,
        });
        await user.save();
      } else {
        const encryptedImage = CryptoJS.AES.encrypt(
          image,
          process.env.MY_SECRET_KEY
        ).toString();
        await user.update({
          firstName: encryptedFirstName,
          lastName: encryptedLastName,
          email: encryptedEmail,
          gender: encryptedGender,
          image: encryptedImage,
        });
        await user.save();
      }
      return res.status(201).json({ msg: "SUCCESS" });
    } else {
      return res.status(400).json({ msg: "EMPTY DATA" });
    }
  } catch (err) {
    console.log("error in updating your data", err);
    return res.status(400).json({ msg: "FAILED" });
  }
};

module.exports = {
  addData,
  showData,
  updateData,
};
