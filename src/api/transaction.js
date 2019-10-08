import axios from "axios";
import "./axiosClient";
import { URL_PREFIX } from './apiBuilder';

const getTransactionId = () => axios.get(`${URL_PREFIX}/sale/transactionId`);

const saveNormalSale = sale => axios.post(`${URL_PREFIX}/sale/normal`, sale);

const saveCreditSale = sale => axios.post(`${URL_PREFIX}/sale/normal`, sale);

// eslint-disable-next-line
export default { getTransactionId, saveNormalSale, saveCreditSale };
