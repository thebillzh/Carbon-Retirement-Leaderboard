NFT is setup using brownie for python

It is based on the ERC721URIStorage.sol contract from openzeppelin. URI is stored on-chain since using Polygon

Additional files needed: 
    .env
        export PRIVATE_KEY = 
        export WEB3_INFURA_PROJECT_ID = 
            or
        export WEB3_ALCHEMY_PROJECT_ID = 

        Note: Alchemy is suggested since free tier includes Polygon


Notes:

Royalties aren't standard in the template contract yet and differ by NFT trading plaform. Found this:
https://cryptomarketpool.com/erc721-contract-that-supports-sales-royalties/

Control over minting: 
    Do we centrally mint and airdrop or create allowlist and details when updating the quarterly leaderboard?
        makrtank: I lean towards the second so we can prompt user for display name preference and other info during mint process