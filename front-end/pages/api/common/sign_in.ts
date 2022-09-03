import {
  T_TOKEN_COOKIE_NAME,
  LOGIN_MESSAGE_PREFIX,
} from "@constants/constants";
import verify from "@lib/api/middlewares/verify";
import logger from "@lib/common/logger";
import prisma from "@lib/common/prisma";
import { ApiRequest, TokenPayload } from "@model/model";
import { Prisma, t_users } from "@prisma/client";
import { CookieSerializeOptions, serialize } from "cookie";
import { utils } from "ethers";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { DateTime } from "luxon";
import { NextApiResponse } from "next";

const JWT_TOKEN_EXPIRES_IN = parseInt(process.env.JWT_TOKEN_EXPIRES_IN);

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export interface SignInReq {
  wallet_pub: string; // wallet public key
  message: string; // random message
  signature: string; // signature of the message
}

const dataSchema = Joi.object<SignInReq>({
  wallet_pub: Joi.string().required(),
  message: Joi.string().required(),
  signature: Joi.string().required(),
});

/**
 * Set token cookie
 * @param resp
 * @param user
 */
export const setTokenCookie = (resp: NextApiResponse, user: t_users) => {
  const jwtPayload = {
    mid: user.id.toString(),
    wallet_pub: user.wallet_pub,
    wallet_type: user.wallet_type,
    uname: user.uname,
    face: user.face,
    gender: user.gender,
    twitter: user.twitter,
    last_login_time: DateTime.fromJSDate(user.last_login_time).toFormat(
      "yyyy-MM-dd HH:mm:ss"
    ),
  } as TokenPayload;
  const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_TOKEN_EXPIRES_IN}h`,
  });
  const cookieOptions = {
    path: "/",
    maxAge: JWT_TOKEN_EXPIRES_IN * 60 * 60,
    expires: new Date(
      new Date().getTime() + JWT_TOKEN_EXPIRES_IN * 60 * 60 * 1000
    ),
  } as CookieSerializeOptions;
  resp.setHeader(
    "Set-Cookie",
    serialize(T_TOKEN_COOKIE_NAME, token, cookieOptions)
  );
};

/**
 * Login api
 * @param req
 * @param resp
 * @returns
 */
const handler = async (
  req: ApiRequest<null, SignInReq>,
  resp: NextApiResponse
) => {
  try {
    if (req.method !== "POST") {
      resp.status(405).json({
        msg: "method not allowed",
      });
      return;
    }
    if (
      utils.verifyMessage(
        `${LOGIN_MESSAGE_PREFIX}${req.data.message}`,
        req.data.signature
      ) !== req.data.wallet_pub
    ) {
      resp.statusCode = 400;
      throw new Error("invalid signature");
    }

    const user = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const user = await tx.t_users.findUnique({
          where: { wallet_pub: req.data.wallet_pub },
          rejectOnNotFound: false,
        });
        if (!user) {
          return tx.t_users.create({
            data: {
              wallet_pub: req.data.wallet_pub,
              wallet_type: "MetaMask", // Only support MetaMask by now
              uname: "Racer",
              last_login_time: DateTime.local().toJSDate(),
            },
          });
        } else {
          const newUser = {
            last_login_time: DateTime.local().toJSDate(),
          } as any;
          return tx.t_users.update({
            data: newUser,
            where: { id: user.id },
          });
        }
      },
      { maxWait: 5000, timeout: 10000 }
    );

    setTokenCookie(resp, user); // set token cookie
    resp.status(200).json({ msg: "ok" });
  } catch (e) {
    logger.logErrorReq(req, e);
    if (resp.statusCode === 200) {
      resp.statusCode = 500;
    }
    resp.json({ msg: "unexpected error" });
    return;
  }
};

export default verify(handler, { dataSchema });
