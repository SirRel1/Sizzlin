const router = require("express").Router();

const Users = require("../../Models/User.js");
const { uploadToS3, getUserPresignedUrls } = require("../../s3.js");

router.get("/", async (req, res) => {
  try {
    const allUsers = await Users.find();

    res.status(200).json({allUsers});
  } catch (error) {
    throw error;
  }
});

router.get('api/users/images', async (req, res) => {
  const userId = req.headers['x-user-id'];

  if(!file | !userId) return res.status(400).json({ message: "Bad request" });

  const { error, presignedUrls } = await getUserPresignedUrls(userId)
  if(error) return res.status(400).json({ message: error.message });

  return res.status(201).json(presignedUrls)
})

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
})
// Work on posting profile image to db
// router.post("/userProfile", async (req, res) => {
//   try {
//     const dbUsers = await Users.updateOne({
//       email: req.body.email,
//       password: req.body.password,
//       profilePic:
//     });


  //   res.status(200).json({ dbUsers, token });
  // } catch (error) {
  //   res.status(404).json({ error: error });
  // }
// });

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
