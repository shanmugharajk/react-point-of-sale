import { Constants } from '../constants';

export const isProd = () => process.env.NODE_ENV === Constants.production;
