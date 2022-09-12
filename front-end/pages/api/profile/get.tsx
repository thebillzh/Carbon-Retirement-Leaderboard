import { NextApiResponse } from "next";
import { ApiRequest } from "@model/model";
import auth from "@lib/api/middlewares/auth";
import verify from "@lib/api/middlewares/verify";
import logger from "@lib/common/logger";
import Joi from "joi";
import prisma from "@lib/common/prisma";
import { t_go_retirements } from "@prisma/client";
import NP from "number-precision";
import { Decimal } from "@prisma/client/runtime";
import { DateTime } from "luxon";

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
    const walletPub = req.params.address.toLowerCase();
    const userPromise = prisma.t_users.findUnique({
      where: { wallet_pub: walletPub },
    });
    const retirementsPromise = prisma.t_go_retirements.findMany({
      where: {
        OR: [
          { beneficiary_address: walletPub },
          {
            AND: [
              {
                OR: [
                  { beneficiary_address: "" },
                  {
                    beneficiary_address:
                      "0x0000000000000000000000000000000000000000",
                  },
                ],
              },
              { creator_address: walletPub },
            ],
          },
        ],
      },
    });
    const respList = await Promise.all([userPromise, retirementsPromise]);
    const userResp = respList[0];
    const retirementsResp = respList[1];
    if (userResp) {
      userResp["total_retirement"] = 0;
      userResp["on_toucan_since"] = "";
    }
    if (retirementsResp && retirementsResp.length > 0) {
      const total_retired = retirementsResp.reduce(
        (acc: Decimal, retirement: t_go_retirements) => {
          return acc.add(retirement.amount);
        },
        new Decimal(0)
      );
      retirementsResp.sort((a: t_go_retirements, b: t_go_retirements) => {
        if (a.retirement_time < b.retirement_time) {
          return -1;
        } else {
          return 1;
        }
      });
      if (userResp) {
        userResp["total_retirement"] = total_retired;
        userResp["on_toucan_since"] = DateTime.fromJSDate(
          retirementsResp[0].retirement_time
        ).toFormat("yyyy-MM-dd HH:mm:ss");
      }
    }
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

export default verify(handler, { method: "get", paramsSchema });
