from brownie import LeaderboardNFT, network, config, accounts
import time

""" from LeaderboardNFT.sol
enum TimeType {
        MONTHLY,
        QUARTERLY,
        BIANNUALLY,
        YEARLY
    }

"""


def deploy():
    account = accounts.add(config["wallets"]["from_key"])  # accounts[0]
    leaderboard = LeaderboardNFT.deploy(
        {"from": account}
    )  # todo:add publish source later
    return LeaderboardNFT[-1]


def mint_NFT(_type, _season_year, _season_unit, _isAllTime, _rank, _to_address):
    leaderboard = LeaderboardNFT[-1]
    tx = leaderboard.mint(
        _type, _season_year, _season_unit, _isAllTime, _rank, _to_address
    )
    tx.wait(1)


def add_to_allowlist(_type, _season_year, _season_unit, _isAllTime, _rank, _to_address):
    leaderboard = LeaderboardNFT[-1]
    tx = leaderboard.addToAllowList(
        _type, _season_year, _season_unit, _isAllTime, _rank, _to_address
    )
    tx.wait(1)


def mint(_to_address):
    leaderboard = LeaderboardNFT[-1]
    tx = leaderboard.mint({"from": _to_address})
    tx.wait(1)


def main():
    deploy()

    """ todo: make formal tests
    made_up_address = accounts[
        0
    ].address  # "0x555B6D9362d4F35596279692F0251Db635165871"

    #add_to_allowlist(0, 2022, 2, False, 7, accounts[0])

    #add_to_allowlist(1, 2022, 3, False, 4, accounts[0])

    # add_to_allowlist(3, 2022, 0, False, 3, accounts[3])

    #mint(accounts[0])
    
    mint(accounts[1])
    mint(accounts[2])
    # mint(accounts[1])
    mint(accounts[3])
    mint(accounts[1])
    """
    """
    # Monthly, 2022, Feb, Not all time, Rank 7
    mint_NFT(0, 2022, 2, False, 7, made_up_address)

    # Quarterly, 2022, Q3, Not all time, Rank 4
    mint_NFT(1, 2022, 3, False, 4, made_up_address)

    # Biannual, 2022, H1, Not all time, Rank 1
    mint_NFT(2, 2022, 1, False, 1, made_up_address)

    # Yearly, 2022, 0, Not all time, Rank 3
    mint_NFT(3, 2022, 0, False, 3, made_up_address)

    # Biannual, 2022, H1, all time, Rank 1
    mint_NFT(2, 2022, 1, True, 1, made_up_address)
    
    leaderboard = LeaderboardNFT[-1]
    print(leaderboard.tokenURI(1))
    print(leaderboard.ownerOf(1))
    print(accounts[0].address)
    """
