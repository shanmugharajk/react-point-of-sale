export interface IUserLogin {
  userId: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  expiresIn: number;
}
