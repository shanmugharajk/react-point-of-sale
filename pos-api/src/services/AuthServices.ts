import { getManager } from "typeorm";
import { User } from "../entity/User";
import { UserLoginPost } from "../dtos/authTypes";

export class AuthServices {
  public async fetchUser(userPost: UserLoginPost): Promise<User> {
    const entityManager = getManager();
    const user: User = await entityManager.findOne(User, {
      id: userPost.userid,
      password: userPost.password
    });
    return user;
  }
}
