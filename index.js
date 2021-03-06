require("dotenv").config();
const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/Resolvers");
const checkAuth = require("./utils/checkAuth");

mongoose
  .connect(process.env.dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to mongoDb..."))
  .catch((error) => {
    console.log(error);
  });

const PORT = process.env.port || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: checkAuth,
});

server
  .listen({ port: PORT })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  })
  .catch((err) => console.error(err));
