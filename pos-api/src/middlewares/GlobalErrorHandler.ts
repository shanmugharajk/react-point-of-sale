import {
  Middleware,
  ExpressErrorMiddlewareInterface
} from "routing-controllers";
import { Request, Response } from "express";

@Middleware({ type: "after" })
export class GlobalErrorHandler implements ExpressErrorMiddlewareInterface {
  error(
    error: Error,
    request: Request,
    response: Response,
    next: (err: any) => any
  ) {
    console.log("===> (error) \n");
    console.log(error);

    if (error) {
      if ((error as any).errors) {
        response.status(400).send(error);
        return;
      }

      if ((error as any).code) {
        response.status(400).send(error);
        return;
      }

      response.status(500).send(error);
      return;
    }
    next(null);
  }
}
