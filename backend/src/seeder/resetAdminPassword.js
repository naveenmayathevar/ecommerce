const mongoose = require("mongoose");
const User = require("../models/user");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);

async function reset() {
  const email = "test@gmail.com";   // 👈 from your screenshot
  const newPassword = "Admin123";   // 👈 new password

  const user = await User.findOne({ email });

  if (!user) {
    console.log("❌ User not found");
    process.exit(1);
  }

  user.password = newPassword; // bcrypt runs automatically
  await user.save();

  console.log("✅ Admin password reset successfully");
  process.exit();
}

reset();

