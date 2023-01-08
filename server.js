const { memoryStorage } = require("multer");
const multer = require("multer");
const { uploadToS3 } = require("./s3");
const express = require("express");
const cors = require("cors")
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require('./utils/auth')


require("dotenv").config();

const db = require("./Config/connection");

const app = express();

const corsOptions = {
  origin: "https://localhost:3000/",
  credentials: true
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  cors: corsOptions
});

// const userRouter = require("./Controllers/api");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(corsOptions));

const PORT = 3001;
const storage = memoryStorage();
const upload = multer({ storage })

// app.use(userRouter);

app.post("/images", upload.single("image"), (req,res) => {
  const { file } = req;
  const userId = req.headers["x-user-id"];

  if(!file || !userId) return res.status(404).json({ message: "Bad request"});

  const { error, key } = uploadToS3({ file, userId });
  if (error) return res.status(500).json({ message: error.message })



  return res.status(201).json({ key });

});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(
        `Use GraphQL at https://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);
