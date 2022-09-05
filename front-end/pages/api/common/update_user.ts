import auth from "@lib/api/middlewares/auth";
import verify from "@lib/api/middlewares/verify";
import logger from "@lib/common/logger";
import prisma from "@lib/common/prisma";
import { ApiRequest } from "@model/model";
import Joi from "joi";
import { NextApiResponse } from "next";
import { setTokenCookie } from "./sign_in";

export interface UpdateUserReq {
  uname: string;
  face: string;
  twitter: string;
  email: string;
  about: string;
}

export interface UpdateUserResp {
  msg: string;
}

const dataSchema = Joi.object<UpdateUserReq>({
  uname: Joi.string().min(1),
  face: Joi.string().min(1),
  twitter: Joi.string().min(1),
  email: Joi.string().min(1),
  about: Joi.string().min(1),
});

const handler = async (
  req: ApiRequest<null, UpdateUserReq>,
  resp: NextApiResponse
) => {
  try {
    if (req.method !== "POST") {
      resp.status(405).json({
        msg: "method not allowed",
      });
      return;
    }
    const newFields = {} as UpdateUserReq;
    for (const key of Object.keys(req.body)) {
      if (req.data[key]) {
        newFields[key] = req.data[key];
      }
    }
    const newUser = await prisma.t_users.update({
      data: newFields,
      where: { id: BigInt(req.user.mid) },
    });

    // After user updated, the cookie should be reset
    setTokenCookie(resp, newUser);
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

export default auth(verify(handler, { dataSchema }));
