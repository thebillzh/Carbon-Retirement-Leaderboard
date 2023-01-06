import {
  MUMBAI_MINT_CONTRACT,
  POLYGON_MUMBAI_RPC_URL,
} from "@constants/constants";
import auth from "@lib/api/middlewares/auth";
import error from "@lib/api/middlewares/error";
import verify from "@lib/api/middlewares/verify";
import logger from "@lib/common/logger";
import prisma from "@lib/common/prisma";
import { CommonError } from "@model/error";
import { ApiRequest } from "@model/model";
import axios from "axios";
import { ethers } from "ethers";
import { NextApiResponse } from "next";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export interface NFTMintResp {
  hash: string;
}

export interface GetAvailableNFTListResp {
  list: Array<AvailableNFT>;
}

interface AvailableNFT {
  id: number;
  rank_type: number;
  rank_year: number;
  rank_season: number;
  rank: number;
}

interface MintMetadata {
  ttype: number;
  year: number;
  timeUnit: number; //half (1,2), quarter (1-4), month (1-12) depends on TimeType
  isAllTime: boolean;
  rank: number;
  hash: string;
  signature: string;
}

const abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getTokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum LeaderboardNFT.TimeType",
        name: "_ttype",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "_seasonYear",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_seasonUnit",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_isAllTime",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "_rank",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_toAddress",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "hash",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_toAddress",
        type: "address",
      },
      {
        components: [
          {
            internalType: "enum LeaderboardNFT.TimeType",
            name: "ttype",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "year",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timeUnit",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isAllTime",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "rank",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "hash",
            type: "bytes32",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
        ],
        internalType: "struct LeaderboardNFT.mintMetadata[]",
        name: "mintMetadataList",
        type: "tuple[]",
      },
    ],
    name: "mintMulti",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "hash",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "recoverSigner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "signatureUsed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const handler = async (
  req: ApiRequest<null, null>,
  resp: NextApiResponse<NFTMintResp>
) => {
  const availableNFTListResp = await axios.get<GetAvailableNFTListResp>(
    `https://api.i.loli.co/service/main/v1/getAvailableNFTList?wallet_pub=${req.user.wallet_pub}`
  );

  const provider = new ethers.providers.JsonRpcProvider(POLYGON_MUMBAI_RPC_URL);
  const signer = new ethers.Wallet(
    process.env.NFT_SIGNER_PRIVATE_KEY,
    provider
  );

  const mintMetadataList = new Array<MintMetadata>();
  for (const nft of availableNFTListResp.data.list) {
    // Compute message hash
    const messageHash = ethers.utils.id(
      `${req.user.wallet_pub}:${nft.rank_type}:${nft.rank_year}:${nft.rank_season}`
    );

    // Sign the message hash
    let messageBytes = ethers.utils.arrayify(messageHash);
    const signature = await signer.signMessage(messageBytes);

    const mintMetadata = {
      ttype: nft.rank_type,
      year: nft.rank_year,
      timeUnit: nft.rank_season,
      isAllTime: false,
      rank: nft.rank,
      hash: messageHash,
      signature: signature,
    } as MintMetadata;

    mintMetadataList.push(mintMetadata);
  }
  if (mintMetadataList.length > 0) {
    const contract = new ethers.Contract(MUMBAI_MINT_CONTRACT, abi, signer);
    try {
      const res = await contract.mintMulti(
        req.user.wallet_pub,
        mintMetadataList
      );
      try {
        await prisma.t_go_nfts.updateMany({
          where: {
            id: {
              in: availableNFTListResp.data.list.map((item) => BigInt(item.id)),
            },
          },
          data: {
            mint_tx: res.hash,
          },
        });
      } catch (err) {
        logger.errorc(
          req,
          `Saving status to db error: ${err}, tx: ${res.hash}`
        );
      }

      resp.status(200).json({ hash: res.hash });
    } catch (err) {
      if (err?.error?.reason?.startsWith("execution reverted: 0x")) {
        throw new CommonError(
          400,
          "This NFT has already been minted: ${err?.error?.reason}"
        );
      }
      logger.errorc(req, `Error calling contract: ${err?.error}`);
      throw new CommonError(
        500,
        "Unexpected error happend when minting your NFTs"
      );
    }
  } else {
    throw new CommonError(400, "You are not eligible");
  }
};

export default auth(verify(error(handler), { method: "post" }));
