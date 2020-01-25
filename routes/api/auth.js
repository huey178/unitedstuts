const express = require("express");
const router = express.Router();

//@route  api/auth
//@desc   test route
//@access public
router.get("/", (req, res) => {
  res.send("Hello there good sir Auth");
});

module.exports = router;
