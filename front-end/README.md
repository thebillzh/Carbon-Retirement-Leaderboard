Front-end for Toucan Leaderboard, writted in ReactJS + NextJS + TailwindCSS.

If you want to run a copy on your computer / server, follow these instructions:

## Set up env file

Create a `.local.env` file in `/front-end`, with the following variables:
```
DATABASE_URL
## Logflare
NEXT_PUBLIC_LOGFLARE_API_KEY=
NEXT_PUBLIC_LOGFLARE_SOURCE_TOKEN=

## key for backend call signature
NEXT_PUBLIC_BACKEND_CALL_SIGN_SECREY_KEY=

## JWT signature secret
JWT_SECRET=

## cron job JWT signature secret
CRON_JWT_SECRET=

## JWTToken expiration time，unit: hour
JWT_TOKEN_EXPIRES_IN=

# owner for NFT minting contracts
NFT_SIGNER_PRIVATE_KEY=
```
## Run locally

1. clone the project
2. `cd front-end && yarn`
3. `npx prisma generate` # initialize prisma
