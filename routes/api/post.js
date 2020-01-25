const express = require("express");
const router = express.Router();

//@route  api/post
//@desc   test route
//@access public

router.get("/", (req, res) => {
  res.send("Hello there good sir Post");
});

module.exports = router;
