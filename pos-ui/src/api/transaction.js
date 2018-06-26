import axios from "axios";
import "./axiosClient";

const getTransactionId = () => axios.get("/api/sale/transactionId");

const saveNormalSale = sale => axios.post("/api/sale/normal", sale);

const saveCreditSale = sale => axios.post("/api/sale/normal", sale);

// eslint-disable-next-line
export default { getTransactionId, saveNormalSale, saveCreditSale };
