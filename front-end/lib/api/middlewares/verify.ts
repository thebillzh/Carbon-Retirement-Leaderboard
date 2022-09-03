import logger from "@lib/common/logger";
import { ApiRequest } from "@model/model";
import {
  BACKEND_BASE_URL,
  T_NONCE_HEADER_NAME,
  T_SIGN_HEADER_NAME,
  T_TIMESTAMP_HEADER_NAME,
} from "constants/constants";
import { createHash, createHmac } from "crypto";
import Joi, { Schema } from "joi";
import _ from "lodash";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

/**
 * Sign the request
 * @param method request method "get" | "post"
 * @param url request url without base url
 * @param params query
 * @param data body
 * @returns signature
 */
export const sign = (
  timestamp: string,
  nonce: string,
  method: "get" | "post" | string,
  url: string,
  params?: {},
  data?: {}
): string => {
  const signParamList = [
    timestamp,
    nonce,
    method.toUpperCase(),
    `${BACKEND_BASE_URL}${url}`,
  ];

  if (params && !_.isEmpty(params)) {
    const searchParams = new URLSearchParams(params);
    searchParams.sort();
    signParamList.push(searchParams.toString());
  }
  if (data) {
    const signData = createHash("sha1")
      .update(JSON.stringify(data))
      .digest("hex");
    signParamList.push(signData);
  }
  const sign = createHmac(
    "sha1",
    process.env.NEXT_PUBLIC_BACKEND_CALL_SIGN_SECREY_KEY
  )
    .update(signParamList.join("\n"))
    .digest("hex");
  return sign;
};

/**
 * Param checking middleware
 * return 400 when invalid signature or bad params
 * return 500 when unexpected error appears
 * @param handler inner layer handler
 * @param schemas paramsSchema is the rule of query, dataSchema is the rule for body
 * @returns onion
 */
const verify =
  <T, U>(
    handler: NextApiHandler,
    {
      method,
      paramsSchema,
      dataSchema,
    }: {
      method?: string;
      paramsSchema?: Joi.Schema<T>;
      dataSchema?: Joi.Schema<U>;
    } = {}
  ) =>
  <T, U>(req: ApiRequest<T, U>, resp: NextApiResponse) => {
    try {
      if (method && req.method.toLowerCase() !== method.toLowerCase()) {
        resp.statusCode = 405;
        throw new Error("method not allowed");
      }
      const inputTimestamp = req.headers[T_TIMESTAMP_HEADER_NAME];
      const inputNonce = req.headers[T_NONCE_HEADER_NAME];
      const inputSign = req.headers[T_SIGN_HEADER_NAME];
      if (!inputTimestamp || !inputNonce || !inputSign) {
        resp.statusCode = 400;
        throw new Error("Bad Request");
      }
      const reSign = sign(
        inputTimestamp as string,
        inputNonce as string,
        req.method,
        req.url.split("?")[0].replace(BACKEND_BASE_URL, ""),
        req.query,
        req.body
      );
      if (inputSign !== reSign) {
        resp.statusCode = 400;
        throw new Error("Bad Request");
      }
      if (paramsSchema) {
        const cr = paramsSchema.validate(req.query);
        if (cr.error) {
          resp.statusCode = 400;
          throw cr.error;
        }
        req.params = cr.value;
      }
      if (dataSchema) {
        const cr = dataSchema.validate(req.body);
        if (cr.error) {
          resp.statusCode = 400;
          throw cr.error;
        }
        req.data = cr.value;
      }
      return handler(req, resp);
    } catch (e) {
      if (resp.statusCode === 200) {
        logger.error(`[verify] error catched: ${e.message}, req: %o`, req);
        resp.statusCode = 500;
      } else {
        logger.warn(`[verify] bad params: ${e.message}, req: %o`, req);
      }
      resp.json({ msg: e.message });
      return;
    }
  };
export default verify;
