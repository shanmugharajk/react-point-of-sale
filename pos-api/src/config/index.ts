interface config {
  jwtSecret: string;
  tokenExpiry: string;
  refreshTokenExpiry: string;
}

export const config: config = {
  jwtSecret: "Ne!lC^fferry_wc0!!ar",
  tokenExpiry: "24h",
  refreshTokenExpiry: "24h"
};
