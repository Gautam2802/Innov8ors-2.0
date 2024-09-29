// controllers/userController.js
const User = require("../models/User");

// Check if user exists or create a new one
const checkUser = async (req, res) => {
  const { name, phoneNumber } = req.body;
  try {
    let user = await User.findOne({ phoneNumber });
    if (user) {
      return res.json({ exists: true });
    }

    user = new User({ name, phoneNumber });
    await user.save();
    res.json({ exists: false });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

module.exports = { checkUser };
