import { NextApiResponse } from "next";
import { ApiRequest } from "@model/model";
import auth from "@lib/api/middlewares/auth";
import verify from "@lib/api/middlewares/verify";
import logger from "@lib/common/logger";
import Joi from "joi";
import prisma from "@lib/common/prisma";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export interface ProfileGetReq {
  address: string;
}

const paramsSchema = Joi.object({
  address: Joi.string().required(),
});

const handler = async (
  req: ApiRequest<ProfileGetReq, null>,
  resp: NextApiResponse
) => {
  try {
    const userResp = await prisma.t_users.findUnique({
      where: { wallet_pub: req.params.address },
    });
    resp.status(200).json(userResp);
  } catch (e) {
    if (resp.statusCode === 200) {
      logger.errorc(
        req,
        `mid: ${req.user.mid}, has unexpected error: ${e.stack}`
      );
      resp.statusCode = 500;
    }
    resp.json({ msg: "unexpected error" });
    return;
  }
};

export default auth(verify(handler, { method: "get", paramsSchema }));
