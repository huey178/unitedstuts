const express = require("express");
const router = express.Router();
const authen = require("../../middleware/authen");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

//@route  api/profile/me
//@desc   Get Current Profile
//@access private

router.get("/me", authen, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "Profile does not exist" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error lol");
  }
});
module.exports = router;
