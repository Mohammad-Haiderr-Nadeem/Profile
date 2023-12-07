const jwt = require("jsonwebtoken");
const modal = require("../models");

process.env.JWT_SECRET_KEY = "bhevfqbhuefvqbhuefqhuefqvb2136872368932678";

const validateUser = async (req, res) => {
  const user = await req.user;
  const accessToken = await req.authInfo;

  const existingUser = await modal.User.findOne({
    where: { googleId: user.googleId },
  });

  if (existingUser) {
    // await existingUser.update({
    //   firstName: user.firstName,
    //   lastName: user.lastName,
    //   email: user.email,
    //   gender: user.gender,
    //   image: user.image,
    //   token: accessToken,
    //   googleId: user.googleId,
    // });
    // await existingUser.save();
    const token = jwt.sign(
      {
        data: existingUser,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.cookie("accessToken", token);
  } else {
    const person = await modal.User.create({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      gender: user.gender,
      image: user.image,
      token: accessToken,
      googleId: user.googleId,
    });
    const token = jwt.sign(
      {
        data: person,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.cookie("accessToken", token);
  }
  res.redirect("http://localhost:3000/profile");
};

module.exports = {
  validateUser,
};
