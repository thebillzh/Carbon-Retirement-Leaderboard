// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

contract LeaderboardNFT is ERC721URIStorage, Ownable {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    enum TimeType {
        MONTHLY,
        QUARTERLY,
        BIANNUALLY,
        YEARLY
    }

    struct TokenMetaData {
        TimeType ttype;
        uint256 year;
        uint256 timeUnit; //half (1,2), quarter (1-4), month (1-12) depends on TimeType
        bool isAllTime;
        uint256 rank;
    }
    mapping(uint256 => TokenMetaData) tokenIdtoMetaData;
    mapping(address => uint256) addresstoTokenId;
    mapping(address => TokenMetaData[]) allowListAddresstoMetaData;
    mapping(address => bool) allowList;

    constructor() ERC721("Toucan NCT Retirement Leaderboard", "TNCTRL") {}

    function generateBaseSVG() private view returns (string memory) {
        string[6] memory parts;
        parts[
            0
        ] = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox='0 0 500 499' width='500pt' height='500pt' fill='#ffffff'>"
        "<path d='M 0 0 L 126.05 0 L 126.69 1.35 C 134.19 20.95 141.81 40.54 149.08 60.21 C 121.60 76.27 99.16 100.48 84.92 "
        "128.92 C 72.32 154.15 66.21 182.83 67.99 211 C 68.45 223.85 70.72 236.74 73.98 249.16 C 49.32 249.14 24.66 249.22 0 "
        "249.20 L 0 0 Z' fill='#fa8e96' />";
        parts[
            1
        ] = "<path d='M 126.05 0 L 301.58 0 L 302.14 0.88 L 302.54 1.55 C 307.20 9.56 311.83 17.58 316.23 25.73 C 318.80 30.55 "
        "321.53 35.08 323.50 40.19 C 304.36 37.19 285.31 37.09 266 37.36 C 243.42 37.38 219.48 36.40 197.25 41.37 C 180.27 45.04 "
        "164.16 51.65 149.08 60.21 C 141.81 40.54 134.19 20.95 126.69 1.35 L 126.05 0 Z' fill='#ffcfcf' />";
        parts[
            2
        ] = "<path d='M 301.58 0 L 500 0 L 500 249.13 C 486.24 249.35 472.46 249.02 458.70 249.15 C 457.66 247.26 456.60 "
        "245.38 455.39 243.59 C 445.95 230.02 436.24 216.57 427.24 202.72 C 425.40 200.02 423.70 197.26 422.26 194.33 C 426.04 193.04 "
        "430.18 190.90 432.56 187.57 C 434.58 184.71 435.12 181.44 435.23 178 C 435.94 126.97 405.74 77.90 360.76 54.22 C 348.97 "
        "47.89 336.43 43.55 323.50 40.19 C 321.53 35.08 318.80 30.55 316.23 25.73 C 311.83 17.58 307.20 9.56 302.54 1.55 L 302.14 0.88 "
        "L 301.58 0 Z' fill='#fa8e96' />";

        parts[
            3
        ] = "<path d='M 221.18 53.74 C 240.02 52.50 259.11 53.52 278 53.24 C 285.67 53.12 293.30 52.96 300.97 53.40 C 319.45 54.70 "
        "337.47 59.28 353.74 68.27 C 373.96 79.14 390.98 95.64 402.53 115.47 C 413.73 134.61 419.86 156.68 419.87 178.87 C 363.45 "
        "178.90 307 178.69 250.58 178.99 C 250 181.80 249.42 184.61 248.90 187.44 C 278.07 189.52 306.52 198.70 330.74 215.24 C "
        "346.27 225.71 359.58 239.19 370.89 254.07 C 396.24 287.57 410.42 328.64 415.86 370.02 C 416.91 376.51 416.96 383.06 418.09 "
        "389.54 C 388.91 390.23 359.80 385.19 333.28 372.75 C 309.38 361.60 288.47 344.27 273.54 322.48 C 258 300.22 248.39 273.28 "
        "243.36 246.73 C 242.70 252.92 243.65 258.86 244.18 265 C 247.05 294.54 256.37 322.82 275.54 345.87 C 268.16 348.07 260.41 "
        "349.23 252.81 350.42 C 243.50 351.33 234.40 352.65 225 351.92 C 217.68 351 210.41 350.57 203.21 348.81 C 202.05 348.45 "
        "200.51 348.33 199.84 347.19 C 195.19 340.67 192.08 332.83 189.89 325.16 C 186.14 311.69 184.43 297.57 183.54 283.64 C 180.63 "
        "302.58 177.99 321.65 175.38 340.65 C 142.04 326.37 114.10 300.50 98.28 267.76 C 80.09 230.34 78.36 185.54 94.04 146.96 C "
        "105.53 118.06 126.38 93.27 152.55 76.54 C 173.06 63.36 196.84 55.42 221.18 53.74 Z' fill='#152239' />";

        parts[
            4
        ] = "<path d='M 300 66.95 C 323.57 67.58 346.35 76.58 364.58 91.38 C 373.57 98.55 381.15 107.11 387.92 116.36 C 379.47 121.33 "
        "371.40 126.41 364.47 133.44 C 348.83 127.27 331.77 124.55 315 125 C 288.69 125 262.39 124.98 236.08 125.02 C 238.98 "
        "105.55 241.92 86.04 244.69 66.56 C 263.32 67.39 281.40 65.05 300 66.95 Z' fill='#ffbb7b' />"
        "<path d='M 213.22 69.77 C 219.69 71.76 224.52 77.44 226.09 83.95 C 227.61 89.23 226.07 95.55 225.60 101 C 222.64 119.99 220 "
        "138.99 217.16 157.95 C 215.07 172.64 213.02 187.37 210.72 202.02 C 207.79 218.18 198.78 234.66 184.83 243.82 C 177.40 248.87 168.28 "
        "251.08 159.48 248.66 C 151.98 246.71 146.26 241.35 141.31 235.65 C 131.98 224.55 127.36 210.28 125.86 196.02 C 124.36 180.05 125.98 "
        "163.64 129.37 148 C 133.24 130.82 140.11 114.09 151.60 100.56 C 163.81 86.08 180.66 75.50 199 70.76 C 203.60 69.55 208.52 68.44 "
        "213.22 69.77 Z' fill='#ffffff' />";
        parts[
            5
        ] = "<path d='M 196.97 93.98 C 195.61 95.56 194.04 96.77 193.80 98.98 C 193.40 102.71 196.43 105.67 200.02 105.94 C 202.55 106.21 204.23 "
        "104.92 206.31 103.75 C 207.57 109.77 206.80 115.79 202.13 120.13 C 195.08 126.63 183.16 125.02 178.30 116.69 C 173.50 109.19 176.84 "
        "98.46 184.92 94.89 C 188.83 93.05 192.82 93.24 196.97 93.98 Z' fill='#152239' />"
        "<path d='M 236.08 125.02 C 262.39 124.98 288.69 125 315 125 C 331.77 124.55 348.83 127.27 364.47 133.44 C 356.25 142.89 351.73 "
        "153.89 348.02 165.70 C 341.02 165.51 334 165.60 327 165.58 C 294.70 165.66 262.39 165.50 230.09 165.64 C 231.96 152.08 234.10 138.56 "
        "236.08 125.02 Z' fill='#fa8e96' />"
        "<path d='M 328.98 194.31 C 360.07 194.26 391.15 194.33 422.26 194.33 C 423.70 197.26 425.40 200.02 427.24 202.72 C 436.24 216.57 445.95 230.02 "
        "455.39 243.59 C 456.60 245.38 457.66 247.26 458.70 249.15 C 451.46 249.59 444.24 249.34 437 249.44 C 422.34 249.48 407.65 249.58 392.99 "
        "249.43 C 388.99 249.46 385.87 247.64 383.30 244.71 C 378.21 238.83 373.59 232.46 368.23 226.78 C 358.18 216.13 346.84 207.53 334.99 199 C "
        "332.92 197.53 330.93 195.95 328.98 194.31 Z' fill='#ffcfcf' />";

        return
            string(
                abi.encodePacked(
                    parts[0],
                    parts[1],
                    parts[2],
                    parts[3],
                    parts[4],
                    parts[5]
                )
            );
    }

    function getTimeName(TimeType _t, uint256 _timeUnit)
        private
        view
        returns (string memory)
    {
        string[12] memory timeUnittoName;
        if (_t == TimeType.MONTHLY) {
            //Monthly
            require((_timeUnit > 0 && _timeUnit < 13), "Invalid time unit");
            timeUnittoName[0] = "Jan";
            timeUnittoName[1] = "Feb";
            timeUnittoName[2] = "Mar";
            timeUnittoName[3] = "Apr";
            timeUnittoName[4] = "May";
            timeUnittoName[5] = "Jun";
            timeUnittoName[6] = "Jul";
            timeUnittoName[7] = "Aug";
            timeUnittoName[8] = "Sep";
            timeUnittoName[9] = "Oct";
            timeUnittoName[10] = "Nov";
            timeUnittoName[11] = "Dec";
        } else if (_t == TimeType.QUARTERLY) {
            //Quarterly
            require((_timeUnit > 0 && _timeUnit < 5), "Invalid time unit");
            timeUnittoName[0] = "Q1";
            timeUnittoName[1] = "Q2";
            timeUnittoName[2] = "Q3";
            timeUnittoName[3] = "Q4";
        } else if (_t == TimeType.BIANNUALLY) {
            //Semi-annual
            require((_timeUnit > 0 && _timeUnit < 3), "Invalid time unit");
            timeUnittoName[0] = "H1";
            timeUnittoName[1] = "H2";
        } else {
            //yearly
            return "";
        }
        return timeUnittoName[_timeUnit - 1];
    }

    function generateSVG(uint256 tokenId) private view returns (string memory) {
        string[7] memory parts;

        TimeType t = tokenIdtoMetaData[tokenId].ttype;
        uint256 timeUnit = tokenIdtoMetaData[tokenId].timeUnit;
        string memory season = getTimeName(t, timeUnit);

        parts[
            0
        ] = "<text x='50%' y='420' text-anchor='middle' font-family='Sans,Arial' font-weight='bold' style='fill: #152239; font-size: 36px;'>Toucan NCT Retirement"
        "<tspan x='50%' y='455'>";

        if (tokenIdtoMetaData[tokenId].isAllTime) {
            parts[1] = string.concat("ALL-TIME - ", season);
        } else {
            parts[1] = season;
        }
        parts[2] = " ";
        parts[3] = tokenIdtoMetaData[tokenId].year.toString();
        parts[4] = "</tspan><tspan x='50%' y='490'>Rank #";
        parts[5] = tokenIdtoMetaData[tokenId].rank.toString();
        parts[6] = "</tspan></text></svg>";

        return
            string(
                abi.encodePacked(
                    parts[0],
                    parts[1],
                    parts[2],
                    parts[3],
                    parts[4],
                    parts[5],
                    parts[6]
                )
            );
    }

    function getTokenURI(uint256 tokenId) public returns (string memory) {
        uint256 timeUnit = tokenIdtoMetaData[tokenId].timeUnit;
        TimeType t = tokenIdtoMetaData[tokenId].ttype;
        string memory season = getTimeName(t, timeUnit);
        if (tokenIdtoMetaData[tokenId].isAllTime) {
            season = string.concat("ALL-TIME - ", season);
        }

        bytes memory dataURI = abi.encodePacked(
            "{",
            '"name": "Toucan NCT Retirement Leaderboard NFT Serial #',
            tokenId.toString(),
            '",',
            '"description": "NCT Retirement Leader #',
            tokenIdtoMetaData[tokenId].rank.toString(),
            " for ",
            season,
            " ",
            tokenIdtoMetaData[tokenId].year.toString(),
            '",',
            '"image_data": "',
            generateBaseSVG(),
            generateSVG(tokenId),
            '"}'
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(dataURI)
                )
            );
    }

    function addToAllowList(
        TimeType _ttype,
        uint256 _seasonYear,
        uint256 _seasonUnit,
        bool _isAllTime,
        uint256 _rank,
        address _toAddress
    ) public onlyOwner {
        TokenMetaData memory metaData = TokenMetaData(
            _ttype,
            _seasonYear,
            _seasonUnit,
            _isAllTime,
            _rank
        );
        allowListAddresstoMetaData[_toAddress].push(metaData);
        allowList[_toAddress] = true;
    }

    function mint() public {
        require(
            allowList[msg.sender] == true,
            "Sorry, you're not allowed to mint."
        );
        TokenMetaData[] memory metaDataArr = allowListAddresstoMetaData[
            msg.sender
        ];
        //mint all NFTs that the address is eligible for
        for (uint256 i = 0; i < metaDataArr.length; i++) {
            _tokenIds.increment();
            uint256 newItemId = _tokenIds.current();
            _safeMint(msg.sender, newItemId);
            tokenIdtoMetaData[newItemId] = metaDataArr[i];
            _setTokenURI(newItemId, getTokenURI(newItemId));
        }

        allowList[msg.sender] = false;
    }

    function adminMint(
        TimeType _ttype,
        uint256 _seasonYear,
        uint256 _seasonUnit,
        bool _isAllTime,
        uint256 _rank,
        address _toAddress
    ) public onlyOwner {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(_toAddress, newItemId);
        tokenIdtoMetaData[newItemId] = TokenMetaData(
            _ttype,
            _seasonYear,
            _seasonUnit,
            _isAllTime,
            _rank
        );
        _setTokenURI(newItemId, getTokenURI(newItemId));
    }

    /**
     * Override isApprovedForAll to auto-approve OS's proxy contract
     */
    function isApprovedForAll(address _owner, address _operator)
        public
        view
        override
        returns (bool isOperator)
    {
        // if OpenSea's ERC721 Proxy Address is detected, auto-return true
        // for Polygon's Mumbai testnet, use 0xff7Ca10aF37178BdD056628eF42fD7F799fAc77c
        if (_operator == address(0x58807baD0B376efc12F5AD86aAc70E78ed67deaE)) {
            return true;
        }

        // otherwise, use the default ERC721.isApprovedForAll()
        return ERC721.isApprovedForAll(_owner, _operator);
    }
}
