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
  origin: "http://localhost:3000/",
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

// app.use(userRouter);

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);
