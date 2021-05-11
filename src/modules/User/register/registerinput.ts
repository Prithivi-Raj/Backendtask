// import { Length, IsEmail } from "class-validator";
// import { Field, InputType } from "type-graphql";
// import { IsEmailAlreadyExist } from "./isemailalreadyexists";

// @InputType()
// export class RegisterInput {
//   @Field()
//   @Length(1,30)
//   username: string;

//   @Field()
//   post: string;

//   @Field()
//   @IsEmail()
//   @IsEmailAlreadyExist({ message: "email already in use" })
//   email: string;

//   @Field()
//   password: string;
// }
import { IsEmail, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { IsEmailAlreadyExist } from './isemailalreadyexists';

@InputType()
export class RegisterInput {
  @Length(3, 255)
  @Field()
  username: string;

  @IsEmail()
  @IsEmailAlreadyExist({
    message: 'User Already exist',
  })
  @Field()
  email: string;

  @Field()
  password: string;

  
}