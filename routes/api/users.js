const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

//@route  api/users
//@desc   test route
//@access public

router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Valid email is required").isEmail(),
    check("password", "Password must have 6 or more characters").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      // test if user exist
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ email: [{ msg: "User already exists" }] });
      }
      // get user gravatar
      const avatar = gravatar.url(email, {
        s: "200", //size of avatar
        r: "pg", //rating of the avatar
        d: "mm" //default image
      });

      user = new User({
        name,
        email,
        password,
        avatar
      });

      // encrpyt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      res.send("User Registered");
    } catch (err) {
      console.error(err);
      res.status(500).json("Server Error");
    }

    // return jsonwebtoken
  }
);

module.exports = router;