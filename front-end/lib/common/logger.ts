import { ApiRequest } from "@model/model";
import pino from "pino";
import { logflarePinoVercel } from "pino-logflare";

// create pino-logflare console stream for serverless functions and send function for browser logs
const { stream, send } = logflarePinoVercel({
  apiKey: "APl_q_OYG0jR",
  sourceToken: "f05e9587-a8df-4cbb-b309-d8449c09d4fa",
});

interface CustomLogger extends pino.Logger {
  logErrorReq: (req: ApiRequest<any, any>, e: Error) => void;
  infoc: (req: ApiRequest<any, any>, msg: string) => void;
  warnc: (req: ApiRequest<any, any>, msg: string) => void;
  errorc: (req: ApiRequest<any, any>, msg: string) => void;
}

// Singleton pino client
const logger = pino(
  {
    browser: {
      // client
      transmit: {
        level: "info",
        send: send,
      },
    },
    level: "debug", // server
    base: {
      env: process.env.VERCEL_ENV || "unknown",
      revision: process.env.VERCEL_GITHUB_COMMIT_SHA,
    },
  },
  stream
) as CustomLogger;

logger.logErrorReq = (req: ApiRequest<any, any>, e: Error) => {
  logger.error(
    `[${req?.url}] params: ${JSON.stringify(
      req?.params
    )}, body: ${JSON.stringify(req?.data)}, err: ${e?.message}`
  );
};

logger.infoc = (req: ApiRequest<any, any>, msg: string) => {
  logger.info(`[${req?.url}] ${msg}`);
};

logger.warnc = (req: ApiRequest<any, any>, msg: string) => {
  logger.warn(`[${req?.url}] ${msg}`);
};

logger.errorc = (req: ApiRequest<any, any>, msg: string) => {
  logger.error(`[${req?.url}] ${msg}`);
};

export default logger;
