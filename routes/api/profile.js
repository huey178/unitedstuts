const express = require("express");
const router = express.Router();
const authen = require("../../middleware/authen");
const Profile = require("../../models/Profile");
const { check, validationResult } = require("express-validator");
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

//@route  api/profile/
//@desc   Get All Profiles
//@access public

router.get("/", async (req, res) => {
  const profiles = await Profile.find().populate("user", ["name", "avatar"]);
  try {
    if (profiles) {
      res.json(profiles);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route  api/profile/user/:user_id
//@desc   get specific person
//@access public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      res.status(400).json({ msg: ["User was not found"] });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post(
  "/",
  [
    authen,
    [
      check("status", "Status is required")
        .not()
        .isEmpty(),
      check("skills", "Skills are required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    //build profile

    const profileFields = {};

    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills)
      profileFields.skills = skills.split(",").map((skill) => skill.trim());

    //build social object for profile
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      profile = new Profile(profileFields);

      await profile.save();
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route  api/profile/experience
//@desc   add Experience
//@access private

router.put(
  "/experience",
  [
    authen,
    [
      check("title", "Title is required")
        .not()
        .isEmpty(),
      check("company", "Company is required")
        .not()
        .isEmpty(),
      check("from", "From is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const exp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experiences.unshift(exp);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route  api/profile/experience/:/exp_id
//@desc   Delete Experience
//@access private
router.delete("/experience/:exp_id", authen, async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id });

  // get index of removed item
  const removeIndex = profile.experiences
    .map((item) => item.id)
    .indexOf(req.params.exp_id);

  profile.experiences.splice(removeIndex, 1);

  await profile.save();
  res.json(profile);
});

//@route  api/profile/experience/:/exp_id
//@desc   Delete Experience
//@access private

router.delete("/", authen, async (req, res) => {
  try {
    //delete profile
    const profile = await Profile.findOneAndRemove({ user: req.user.id });
    //delete user
    const user = await User.findOneAndRemove({ _id: req.user.id });

    res.json("User Removed");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route  api/profile/education
//@desc   Add Education
//@access private

router.put(
  "/education",
  [
    authen,
    [
      check("school", "School is required")
        .not()
        .isEmpty(),
      check("degree", "Degree is required")
        .not()
        .isEmpty(),
      check("fieldofstudy", "Field of study is required")
        .not()
        .isEmpty(),
      check("from", "From date is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const edu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(edu);

      await profile.save();
      res.json(body);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
