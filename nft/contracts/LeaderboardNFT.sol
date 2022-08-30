// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract LeaderboardNFT is ERC721URIStorage {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    enum Type {
        SEASONAL,
        ALL_TIME
    }

    mapping(uint256 => Type) tokenIdtoType;
    mapping(uint256 => uint16) tokenIdtoSeasonYear;
    mapping(uint256 => uint16) tokenIdtoSeasonQuarter;

    constructor() ERC721("Toucan Carbon Leaderboard", "TCLDR") {}

    function getTokenURI(uint256 tokenId) public returns (string memory) {
        bytes memory dataURI = abi.encodePacked(
            "{",
            '"name": "Toucan Carbon Leaderboard #',
            tokenId.toString(),
            '",',
            '"description": "Carbon Leader for Season Q',
            tokenIdtoSeasonQuarter[tokenId],
            " ",
            tokenIdtoSeasonYear[tokenId],
            '",',
            '"image": "TBD - SVG on chain?"',
            "}"
        );
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(dataURI)
                )
            );
    }

    function mint(
        uint16 _seasonQuarter,
        uint16 _seasonYear,
        Type _type
    ) public {
        /* fixme: we mint and airdrop or add wallet addresses and other details to allow list? 
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: caller is not owner nor approved"
        );
        */
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        tokenIdtoSeasonQuarter[newItemId] = _seasonQuarter;
        tokenIdtoSeasonYear[newItemId] = _seasonYear;
        _setTokenURI(newItemId, getTokenURI(newItemId));
    }
}
