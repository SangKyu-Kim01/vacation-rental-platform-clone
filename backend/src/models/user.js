const mongoose = require("mongoose");
const validator = require("validator"); // This validator can only validate strings

const userSchema = new mongoose.Schema({
  auth0Id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  imageName: {
    type: String,
    default: "7ef6d0e25eaa382bc6992c017b3f4f99778eeda42e82993a306e86559a377d74",
  },
  imageUrl: {
    type: String,
  },
  phone: {
    type: String,
    maxlength: 20,
    validate: {
      validator: function (phone) {
        return validator.isMobilePhone(phone, "any", { strictMode: false });
      },
      message: (props) => `${props.value} is not a valid phone number`,
    },
  },
  role: {
    type: String,
    enum: ["Guest", "Admin"],
    default: "Guest",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  chatIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
