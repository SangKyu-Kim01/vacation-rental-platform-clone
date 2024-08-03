const User = require("../models/user");
const sharp = require("sharp");
const { uploadFile, deleteFile, getObjectSignedUrl } = require("../s3");
const crypto = require("crypto");
const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const getCurrentUser = async (req, res) => {
  try {
    const currentUser = await User.findOne({ _id: req.userId });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    currentUser.imageUrl = await getObjectSignedUrl(currentUser.imageName);

    res.json(currentUser);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

const createUser = async (req, res) => {
  try {
    const { auth0Id } = req.body;
    const existingUser = await User.findOne({ auth0Id });
    if (existingUser) {
      return res.status(200).send();
    }
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error creating user" });
  }
};
const updateUser = async (req, res) => {
  try {
    const { username, address, country, city, phone } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    user.username = username;
    user.address = address;
    user.country = country;
    user.city = city;
    user.phone = phone;
    if (req.file) {
      const file = req.file;
      const imageName = generateFileName();

      const fileBuffer = await sharp(file.buffer)
        .resize({ height: 300, width: 300, fit: "contain" })
        .toBuffer();

      await uploadFile(fileBuffer, imageName, file.mimetype);
      user.imageName = imageName;
    }

    await user.save();
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error updating user" });
  }
};

module.exports = {
  getCurrentUser,
  createUser,
  updateUser,
};
