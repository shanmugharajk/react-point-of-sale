import axiosClient, { setAuthorizationHeader } from "../../libs/axiosClient";
import { HOST } from "../../constants";

const loginService = {
  login: async ({
    username,
    password
  }: {
    username: string;
    password: string;
  }) => {
    try {
      const res = await axiosClient.post(`${HOST}/login`, {
        userid: username,
        password
      });
      const { data: { jwt = "" } = {} } = res.data;

      if (!jwt) {
        setAuthorizationHeader();
        throw new Error("Invalid credentials");
      } else {
        setAuthorizationHeader(jwt);
        return jwt;
      }
    } catch (error) {
      if (error.response && error.response.status === 401)
        throw new Error("Invalid credentials.");
      if (error.response && error.response.status > 200)
        throw new Error("Server error, please try again after sometime.");
      else throw error;
    }
  },

  isAuthenticated: () => !!sessionStorage.getItem("token")
};

export default loginService;
