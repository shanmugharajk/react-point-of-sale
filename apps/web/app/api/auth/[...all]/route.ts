import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "~/lib/auth";

const handlers = toNextJsHandler(auth.handler);

export const GET = handlers.GET;
export const POST = handlers.POST;
