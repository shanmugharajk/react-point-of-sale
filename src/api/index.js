import axios from "axios";
import apiBuilder, { URL_PREFIX } from "./apiBuilder";
import "./axiosClient";
import transaction from "./transaction";

const auth = {
  login: async ({ username, password }) => {
    try {
      const res = await axios.post(`${URL_PREFIX}/login`, {
        userid: username,
        password
      });
      const { authToken } = res.data;

      if (!authToken) throw new { error: "Invalid credentials" }();
      else return res.data;
    } catch (error) {
      if (error.response && error.response.status === 401)
        throw new Error("Invalid credentials.");
      if (error.response && error.response.status > 200)
        throw new Error("Server error, please try again after sometime.");
      else throw error;
    }
  }
};

const productType = apiBuilder("producttypes");

const expenseType = apiBuilder("expensetypes");

const expense = apiBuilder("expenses");

const product = apiBuilder("products");

const customer = apiBuilder("customers");

const vendor = apiBuilder("vendors");

const receiving = apiBuilder("receivings");

export default {
  auth,
  productType,
  product,
  customer,
  expense,
  expenseType,
  vendor,
  receiving,
  transaction
};
