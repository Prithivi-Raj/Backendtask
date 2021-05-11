// import "reflect-metadata";
// import { ApolloServer } from "apollo-server-express";

// import { buildSchema } from "type-graphql";
// import express from "express";

// import { createConnection } from "typeorm";
// import {RegisterResolver} from "./modules/user/register";

// const main = async () => {
// await createConnection();

//   const schema = await buildSchema({
//     resolvers: [RegisterResolver]
//   });

//   const apolloServer = new ApolloServer({ schema });

  
//   const app = express();
//   apolloServer.applyMiddleware({ app });

//   app.listen(4000, () => {
//     console.log("server started on http://localhost:4000/graphql");
//   });
// };

// main();

import 'reflect-metadata';

import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import Register from './modules/User/Register';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { redis } from './redis';
import cors from 'cors';
import Login from './modules/User/Login';
import Me from './modules/User/Me';
import PostResolver from './modules/Post/Post';
import { Logout } from './modules/User/Logout';
import ConfirmEmailResover from './modules/User/ConfirmEmailResolver';
import { ForgetPasswordResolver } from './modules/User/ForgotPassword';

//  to access self-signed server that accept email
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const main = async () => {
  try {
    //  connect to the db
    await createConnection();

    // define schema
    const schema = await buildSchema({
      resolvers: [
        Register,
        ConfirmEmailResover,
        ForgetPasswordResolver,
        Login,
        Logout,
        Me,
        PostResolver,
      ],
      authChecker: ({ context: { req } }) => {
        return !!req.session.userId;
      },
    });

    const apolloServer = new ApolloServer({
      schema,
      // pass the express request to access the sesstions
      context: ({ req, res }) => ({ req, res }),
    });

    const app = Express();

    app.use(
      cors({
        credentials: true,
        origin: 'http://localhost:4000',
      })
    );

    // connect to redis
    const RedisStore = connectRedis(session);
    //  add session
    app.use(
      session({
        store: new RedisStore({
          client: redis as any,
        }),
        name: 'Auth',
        secret: 'fksfpajslkafd',
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 1000 * 606 * 60 * 24 * 365,
        },
      })
    );

    apolloServer.applyMiddleware({ app });

    const PORT = process.env.PORT || 4000;

    app.listen(PORT, () => console.log(`Server run on port ${PORT}`));
  } catch (error) {
    console.log(error.message);
  }
};
main();
