import gql from "graphql-tag";

const postTypeDefs = gql`
  type Reaction {
    user: ID!
    type: String!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
    reactions: [Reaction!]!
    createdAt: String!
    updatedAt: String!
  }

  type Post {
    id: ID!
    title: String!
    description: String
    author: User!
    comments: [Comment!]!
    reactions: [Reaction!]!
    createdAt: String!
    updatedAt: String!
  }

  input CreatePostInput {
    title: String!
    description: String
    userId: ID!
  }

  type TipResponse {
    success: Boolean!
    message: String!
    url: String
  }

  input ClientUserInput {
    id: String!
    email: String!
  }

  input CreateCommentInput {
    postId: ID!
    text: String!
  }

  type Query {
    getAllPosts: [Post!]!
    getPostById(id: ID!): Post
  }

  type Mutation {
    createPost(input: CreatePostInput!): Post!
    createComment(input: CreateCommentInput!): Comment!
    tipAuthor(
      postId: ID!
      amount: Int!
      clientUser: ClientUserInput!
    ): TipResponse!
  }
`;

export default postTypeDefs;
