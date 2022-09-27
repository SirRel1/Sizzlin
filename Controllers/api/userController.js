const router = require("express").Router();

const Users = require("../../Models/User.js");

router.get("/", async (req, res) => {
  try {
    const allUsers = await Users.find();

    res.status(200).json({allUsers});
  } catch (error) {
    throw error;
  }
});

router.post("/login", async (req, res) => {
  try {
    const dbUsers = await Users.create({
      email: req.body.email,
      password: req.body.password,
    });

    const token = dbUsers.createJWT()

    res.status(200).json({ dbUsers, token });
  } catch (error) {
    res.status(404).json({ error: error });
  }
});

router.post("/register", async (req, res) => {
  try {
    const dbUsers = await Users.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    const token = dbUsers.createJWT()

    res.status(200).json({ dbUsers, token });
  } catch (error) {
    res.status(404).json({ error: error });
  }
});

module.exports = router;
