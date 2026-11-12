import type { Role } from "@point-of-sale/contracts";

// Who performs a write. Transports derive it from the session; services
// enforce authorization against it.
export type Actor = {
  userId: string;
  role: Role;
};
