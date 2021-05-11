
// import {
//     Resolver, Query, Mutation, Arg} from "type-graphql";
//   import * as bcrypt from "bcryptjs";
  
//   import {  User } from "../../entity/user";
  
//   @Resolver(User)
//   export class RegisterResolver {
//     @Query(() => String)
//     async hello() {
//       return "Hello World!";
//     }
  
    
//     @Mutation(() => User)
//     async register(
//       @Arg("userName") userName: string,
//       @Arg("email") email: string,
//       @Arg("posts") post : string,
//       @Arg("password") password: string
      
//     ): Promise<User> {
//       const hashedPassword = await bcrypt.hash(password, 12);
  
//       const user = await User.create({
//         userName,
//         email,
//         post,
//         password: hashedPassword
//       }).save();
  
//       return user;
//     }
//   }


import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User } from '../../entity/User';
import { RegisterInput } from './register/RegisterInput';
import { sendEmail } from '../utils/sendEmail';
import { createConfirmationUrl } from '../utils/createConfirmUrl';
@Resolver(User)
class Register {
  @Query(() => String)
  async health() {
    return 'healthy';
  }

  @Mutation(() => User)
  async register(
    @Arg('data') { username, password, email }: RegisterInput
  ): Promise<User> {
    console.log('hello world');

    //   hash the password
    const hashedPassword = await bcrypt.hash(password, 10);


    //  create the user
    const user = await User.create({
      username,
      password: hashedPassword,
      email,
      posts: [],
    }).save();

    user.posts = [];

    // Confirm the email
    await sendEmail(email, await createConfirmationUrl(user.id));

    return user;
  }
}

export default Register;