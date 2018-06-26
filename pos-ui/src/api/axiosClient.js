import axios from "axios";
import { setAuthorizationHeader } from "../utils";

setAuthorizationHeader(sessionStorage.getItem("token"));

// Add a response interceptor
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const { data } = error.response;

      if (data.message) {
        return Promise.reject(new Error(data.message));
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
