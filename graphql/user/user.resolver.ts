import * as userService from '../../services/userService';
import { CreateUserInput, LoginUserInput, UpdateUserInput } from './user.types';

export const userResolvers = {
  Query: {
    users: () => userService.getAllUsers(),
    user: (_: any, { id }: { id: string }) => userService.getUserById(id),
  },
  Mutation: {
    registerUser: (_: any, { input }: { input: CreateUserInput }) =>
      userService.registerUser(input),

    loginUser: (_: any, { input }: { input: LoginUserInput }) =>
      userService.loginUser(input),

    createUser: (_: any, { input }: { input: CreateUserInput }) =>
      userService.createUser(input.name, input.email, input.password),

    updateUser: (_: any, { id, input }: { id: string; input: UpdateUserInput }) =>
      userService.updateUserById(id, input),

    deleteUser: (_: any, { id }: { id: string }) =>
      userService.deleteUserById(id),
  },
};
