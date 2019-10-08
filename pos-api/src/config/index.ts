interface config {
  jwtSecret: string;
  tokenExpiry: string;
  refreshTokenExpiry: string;
}

const devConfig: config = {
  jwtSecret: 'Ne!lC^fferry_wc0!!ar',
  tokenExpiry: '24h',
  refreshTokenExpiry: '24h'
};

const prodConfig: config = {
  jwtSecret: process.env.JWT_SECRET,
  tokenExpiry: '24h',
  refreshTokenExpiry: '24h'
};

export const config: config = process.env.IS_PROD ? prodConfig : devConfig;
