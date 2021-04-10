import { Constants } from '@pos-api/constants';

export const isProd = () => process.env.NODE_ENV === Constants.production;
