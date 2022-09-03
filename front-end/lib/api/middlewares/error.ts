import logger from "@lib/common/logger";
import { CommonError } from "@model/error";
import { ApiRequest } from "@model/model";
import { NextApiHandler, NextApiResponse } from "next";

/**
 * Error handler middleware
 * @param handler inner layer handler
 * @returns onion
 */
const error = <T, U>(handler: NextApiHandler) => {
  return async (req: ApiRequest<T, U>, resp: NextApiResponse) => {
    try {
      await handler(req, resp);
    } catch (e) {
      console.trace(e);
      logger.logErrorReq(req, e);
      if (e instanceof CommonError) {
        resp.statusCode = e.status;
        resp.json({ msg: e.message });
      }
      if (resp.statusCode === 200) {
        resp.statusCode = 500;
        resp.json({ msg: "unexpected error" });
      }
      return;
    }
  };
};

export default error;
