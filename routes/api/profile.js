const express = require("express");
const router = express.Router();

//@route  api/profile
//@desc   test route
//@access public

router.get("/", (req, res) => {
  res.send("Hello there good sir profile");
});

module.exports = router;
