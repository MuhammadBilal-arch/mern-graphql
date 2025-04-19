import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
dotenv.config();

import { typeDefs, resolvers } from "./graphql";
import connectDB from "./config/db";
import { getTokenFromHeaders, JwtPayload, verifyToken } from "./config/auth";


connectDB();

const app = express();
app.use(cors());
app.use(express.json());

export interface MyContext {
  user?: JwtPayload | null;
  req: Request; 
  res: Response; 
}

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
});

await server.start();

app.use(
  "/graphql",
  expressMiddleware(server, {
    context: async ({ req, res }): Promise<MyContext> => {
      const token = getTokenFromHeaders(req);
      let user = null;
      if(token){
        try {
          user = verifyToken(token);
        } catch (error) {
          console.log('Token verification failed:',error)
        }
      }
      return { user, req, res };
    },
  })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}/graphql`)
);
