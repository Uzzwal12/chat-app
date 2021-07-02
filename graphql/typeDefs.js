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
  type Reaction {
    id: ID!
    content: String!
    createdAt: String!
    message: Message!
    user: User!
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
    reactToMessage(id: ID!, content: String!): Reaction!
  }
  type Subscription {
    newMessage: Message!
    newReaction: Reaction!
  }
`;