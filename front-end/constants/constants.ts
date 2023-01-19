export const EMAIL_VERIFY_CODE_KEY = "dcevc"; // email verify code key
export const EMAIL_VERIFY_CODE_EXPIRED_TIME = 60; // email verify code expired time

export const T_TIMESTAMP_HEADER_NAME = "x-t-timestamp"; // header of timestamp
export const T_NONCE_HEADER_NAME = "x-t-nonce"; // header of nonce
export const T_SIGN_HEADER_NAME = "x-t-sign"; // header of signature
export const T_TOKEN_COOKIE_NAME = "t-token"; // token cookie name

export const BASE_PATH = "/"; // base url
export const BACKEND_BASE_URL = "/api"; // backend base url

export const TICKET_INVITE_CODE = "invite_code"; // invite code ticket
export const INVITE_CODE_LENGTH = 8; // invite code length

export const COMMON_CONTEXT_LOCAL_STORATE_KEY = "t-common"; // presist common context key in local storage
export const LOGIN_MESSAGE_PREFIX =
  "You are signing in the Toucan Leaderboard with disposable ticket: "; // login message prefix

export const POLYGON_MUMBAI_RPC_URL =
  "https://polygon-mumbai.g.alchemy.com/v2/9augb8rZZ1c9rR_0voZWbn_ntnJk13_S";
export const POLYGON_MUMBAI_CHAIN_ID = 80001;

export const RANKING_API_BASE_URL =
  "https://external.loli.co/toucan-leaderboard/service-main/v1/getLeaderboard";
export const RANKING_API_BASE_URL_PROXY =
  "/p/toucan-leaderboard/service-main/v1/getLeaderboard"; // use proxy (set in nextjs config) to resolve cors issues

export const MUMBAI_MINT_CONTRACT =
  "0x292EAc1704F5A15ECCd3650777c8e0dDBE6A795F"; // contract to mint nft, production: 0x292EAc1704F5A15ECCd3650777c8e0dDBE6A795F
