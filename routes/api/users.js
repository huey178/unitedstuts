const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

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
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);
    res.send("Hello there good sir users");
  }
);

module.exports = router;
