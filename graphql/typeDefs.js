const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    username: String!
    email: String
    createdAt: String!
    token: String
    latestMessage: Message
    imageUrl: String
  }

  type Message {
    id: ID!
    content: String!
    from: String!
    to: String!
    createdAt: String!
  }
  type Query {
    getUsers: [User]!
    login(username: String!, password: String!): User!
    getMessages(username: String!): [Message]!
  }
  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User!
    sendMessage(to: String!, content: String!): Message!
  }
  type Subscription {
    newMessage: Message!
  }
`;
