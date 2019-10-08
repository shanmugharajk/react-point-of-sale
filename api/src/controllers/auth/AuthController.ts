import { Post, Body, JsonController, UseAfter } from "routing-controllers";
import { AuthServices } from "../../services/AuthServices";
import * as jwt from "jsonwebtoken";
import { config } from "../../config";
import { UserLoginPost, Claim } from "../../dtos/authTypes";

@JsonController()
export class AuthController {
  constructor(private authServices: AuthServices) {}

  @Post("/login")
  public async login(@Body() user: UserLoginPost) {
    const userDetails = await this.authServices.fetchUser(user);

    if (!userDetails) {
      throw new Error("Invalid user credentials.");
    }

    const claim: Claim = {
      userid: userDetails.id,
      role: userDetails.role
    };

    const authToken = jwt.sign(claim, config.jwtSecret, {
      expiresIn: config.tokenExpiry
    });
    const refreshToken = jwt.sign(claim, config.jwtSecret, {
      expiresIn: config.refreshTokenExpiry
    });

    return {
      authToken,
      refreshToken
    };
  }
}
