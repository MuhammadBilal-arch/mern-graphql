import gql from "graphql-tag";

const userTypeDefs = gql`
  type AuthPayload {
    token: String!
    user: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginUserInput {
    email: String!
    password: String!
  }

  input UpdateUserInput {
    name: String
    email: String
    password: String
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    loginUser(input: LoginUserInput!): AuthPayload!
    registerUser(input: CreateUserInput!): AuthPayload!
    createUser(input: CreateUserInput): User
    updateUser(id: ID!, input: UpdateUserInput): User
    deleteUser(id: ID!): Boolean
  }
`;

export default userTypeDefs;
