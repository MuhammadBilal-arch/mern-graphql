import { mergeTypeDefs } from '@graphql-tools/merge';
import { mergeResolvers } from '@graphql-tools/merge';

import userTypeDefs from './user/user.typeDefs';
import { userResolvers } from './user/user.resolver';

import postTypeDefs from './post/post.typeDefs';
import { postResolvers } from './post/post.resolver';

export const typeDefs = mergeTypeDefs([userTypeDefs, postTypeDefs]);
export const resolvers = mergeResolvers([userResolvers , postResolvers]);
