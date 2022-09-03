from brownie import LeaderboardNFT, network, config, accounts
import time


def deploy():
    account = accounts.add(config["wallets"]["from_key"])  # accounts[0]
    leaderboard = LeaderboardNFT.deploy(
        {"from": account}
    )  # todo:add publish source later
    return LeaderboardNFT[-1]


def mint_NFT(_season_quarter, _season_year, _type, _rank, _to_address):
    leaderboard = LeaderboardNFT[-1]
    tx = leaderboard.mint(_season_quarter, _season_year, _type, _rank, _to_address)
    tx.wait(1)


def main():
    deploy()
    made_up_address = accounts[
        0
    ].address  # "0x555B6D9362d4F35596279692F0251Db635165871"
    mint_NFT(2, 2022, 1, 2, made_up_address)
    leaderboard = LeaderboardNFT[-1]
    print(leaderboard.tokenURI(1))
    print(leaderboard.ownerOf(1))
    print(accounts[0].address)
