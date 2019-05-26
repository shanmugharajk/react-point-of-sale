import axios from "axios";

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

const setAuthorizationHeader = (token = "") => {
  if (token) {
    sessionStorage.setItem("token", token);
    axios.defaults.headers.common.authorization = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.authorization;
  }
};

const updateAuthorizationHeader = () => {
  const token = sessionStorage.getItem("token");
  axios.defaults.headers.common.authorization = `Bearer ${token}`;
};

export { updateAuthorizationHeader, setAuthorizationHeader };

export default axios;
