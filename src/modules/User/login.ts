import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User } from '../../entity/User';
import LoginInput from './login/LoginInput';
import { MyContext } from 'src/types/MyContext';
@Resolver(User)
class Login {
  @Mutation(() => User, {
    nullable: true,
  })
  async login(
    @Arg('data') { password, email }: LoginInput,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const user = await User.findOne({
      relations: ['posts'],
      where: {
        email,
      },
    });

    // Validation
    if (!user) throw new Error('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');

    if (!user.confirmed)
      throw new Error('Confirm you email before going forward');
    //   send the sesstion
    ctx.req.session!.userId! = user.id;

    return user;
  }
}

export default Login;