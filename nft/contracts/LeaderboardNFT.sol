// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

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

    struct tokenMetaData {
        TimeType ttype;
        uint256 year;
        uint256 timeUnit; //half (1,2), quarter (1-4), month (1-12) depends on TimeType
        bool isAllTime;
        uint256 rank;
    }
    mapping(uint256 => tokenMetaData) tokenIdtoMetaData;
    mapping(address => uint256) addresstoTokenId;

    constructor() ERC721("Toucan NCT Retirement Leaderboard", "TNCTRL") {}

    function generateBaseSVG() private view returns (string memory) {
        string[6] memory parts;
        parts[
            0
        ] = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox='0 0 500 499' width='500pt' height='500pt' fill='#ffffff'>"
        "<clipPath id='a'><rect width='100%' height='100%' rx='10%'/></clipPath><rect width='100%' height='100%' fill='#FFF' "
        "clip-path='url(#a)'/>"
        "<path d='M0 0h126.05l.64 1.35c7.5 19.6 15.12 39.19 22.39 58.86-27.48 16.06-49.92 40.27-64.16 68.71-12.6 25.23-18.71 53.91-16.93 "
        "82.08.46 12.85 2.73 25.74 5.99 38.16-24.66-.02-49.32.06-73.98.04V0Z' fill='#fa8e96' clip-path='url(#a)'/>";
        parts[
            1
        ] = "<path d='M126.05 0h175.53l.56.88.4.67c4.66 8.01 9.29 16.03 13.69 24.18 2.57 4.82 5.3 9.35 7.27 "
        "14.46-19.14-3-38.19-3.1-57.5-2.83-22.58.02-46.52-.96-68.75 4.01-16.98 3.67-33.09 "
        "10.28-48.17 18.84-7.27-19.67-14.89-39.26-22.39-58.86L126.05 0Z' fill='#ffcfcf'/>";
        parts[
            2
        ] = "<path d='M301.58 0H500v249.13c-13.76.22-27.54-.11-41.3.02-1.04-1.89-2.1-3.77-3.31-5.56-9.44-13.57-19.15-27.02-28.15-40.87-1.84-2.7-3.54-5.46-4.98-8.39 3.78-1.29 "
        "7.92-3.43 10.3-6.76 2.02-2.86 2.56-6.13 2.67-9.57.71-51.03-29.49-100.1-74.47-123.78-11.79-6.33-24.33-10.67-37.26-14.03-1.97-5.11-4.7-9.64-7.27-14.46-4.4-8.15-9.03-16.17-13.69-24.18l-.4-.67-.56-.88Z' "
        "fill='#fa8e96' clip-path='url(#a)'/>";

        parts[
            3
        ] = "<path d='M221.18 53.74c18.84-1.24 37.93-.22 56.82-.5 7.67-.12 15.3-.28 22.97.16 18.48 1.3 36.5 5.88 52.77 14.87 20.22 10.87 "
        "37.24 27.37 48.79 47.2 11.2 19.14 17.33 41.21 17.34 63.4-56.42.03-112.87-.18-169.29.12-.58 2.81-1.16 5.62-1.68 8.45 29.17 2.08 57.62 "
        "11.26 81.84 27.8 15.53 10.47 28.84 23.95 40.15 38.83 25.35 33.5 39.53 74.57 44.97 115.95 1.05 6.49 1.1 13.04 2.23 "
        "19.52-29.18.69-58.29-4.35-84.81-16.79-23.9-11.15-44.81-28.48-59.74-50.27-15.54-22.26-25.15-49.2-30.18-75.75-.66 6.19.29 12.13.82 18.27 "
        "2.87 29.54 12.19 57.82 31.36 80.87-7.38 2.2-15.13 3.36-22.73 4.55-9.31.91-18.41 2.23-27.81 "
        "1.5-7.32-.92-14.59-1.35-21.79-3.11-1.16-.36-2.7-.48-3.37-1.62-4.65-6.52-7.76-14.36-9.95-22.03-3.75-13.47-5.46-27.59-6.35-41.52-2.91 "
        "18.94-5.55 38.01-8.16 57.01-33.34-14.28-61.28-40.15-77.1-72.89-18.19-37.42-19.92-82.22-4.24-120.8 11.49-28.9 32.34-53.69 58.51-70.42 "
        "20.51-13.18 44.29-21.12 68.63-22.8Z' fill='#152239'/>";

        parts[
            4
        ] = "<path d='M300 66.95c23.57.63 46.35 9.63 64.58 24.43 8.99 7.17 16.57 15.73 23.34 24.98-8.45 4.97-16.52 10.05-23.45 "
        "17.08-15.64-6.17-32.7-8.89-49.47-8.44-26.31 0-52.61-.02-78.92.02 2.9-19.47 5.84-38.98 8.61-58.46 18.63.83 36.71-1.51 55.31.39Z' "
        "fill='#ffbb7b'/>"
        "<path d='M213.22 69.77c6.47 1.99 11.3 7.67 12.87 14.18 1.52 5.28-.02 11.6-.49 17.05-2.96 18.99-5.6 37.99-8.44 56.95-2.09 "
        "14.69-4.14 29.42-6.44 44.07-2.93 16.16-11.94 32.64-25.89 41.8-7.43 5.05-16.55 7.26-25.35 "
        "4.84-7.5-1.95-13.22-7.31-18.17-13.01-9.33-11.1-13.95-25.37-15.45-39.63-1.5-15.97.12-32.38 3.51-48.02 3.87-17.18 10.74-33.91 "
        "22.23-47.44 12.21-14.48 29.06-25.06 47.4-29.8 4.6-1.21 9.52-2.32 14.22-.99Z'/>";
        parts[
            5
        ] = "<path d='M196.97 93.98c-1.36 1.58-2.93 2.79-3.17 5-.4 3.73 2.63 6.69 6.22 6.96 2.53.27 4.21-1.02 6.29-2.19 1.26 6.02.49 12.04-4.18 "
        "16.38-7.05 6.5-18.97 4.89-23.83-3.44-4.8-7.5-1.46-18.23 6.62-21.8 3.91-1.84 7.9-1.65 12.05-.91Z' fill='#152239'/>"
        "<path d='M236.08 125.02c26.31-.04 52.61-.02 78.92-.02 16.77-.45 33.83 2.27 49.47 8.44-8.22 9.45-12.74 20.45-16.45 "
        "32.26-7-.19-14.02-.1-21.02-.12-32.3.08-64.61-.08-96.91.06 1.87-13.56 4.01-27.08 5.99-40.62Z' fill='#fa8e96' clip-path='url(#a)'/>"
        "<path d='M328.98 194.31c31.09-.05 62.17.02 93.28.02 1.44 2.93 3.14 5.69 4.98 8.39 9 13.85 18.71 27.3 28.15 40.87 1.21 1.79 2.27 3.67 "
        "3.31 5.56-7.24.44-14.46.19-21.7.29-14.66.04-29.35.14-44.01-.01-4 "
        ".03-7.12-1.79-9.69-4.72-5.09-5.88-9.71-12.25-15.07-17.93-10.05-10.65-21.39-19.25-33.24-27.78-2.07-1.47-4.06-3.05-6.01-4.69Z' "
        "fill='#ffcfcf'/>";

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

    // Signature tracker
    mapping(bytes => bool) public signatureUsed;

    // Allowlist addresses
    function recoverSigner(bytes32 hash, bytes memory signature)
        public
        pure
        returns (address)
    {
        bytes32 messageDigest = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
        );
        return ECDSA.recover(messageDigest, signature);
    }

    function mint(
        TimeType _ttype,
        uint256 _seasonYear,
        uint256 _seasonUnit,
        bool _isAllTime,
        uint256 _rank,
        address _toAddress,
        bytes32 hash,
        bytes memory signature
    ) public onlyOwner {
        require(
            recoverSigner(hash, signature) == owner(),
            "Address is not allowlisted"
        );
        require(!signatureUsed[signature], "Signature has already been used.");

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(_toAddress, newItemId);
        tokenIdtoMetaData[newItemId] = tokenMetaData(
            _ttype,
            _seasonYear,
            _seasonUnit,
            _isAllTime,
            _rank
        );
        _setTokenURI(newItemId, getTokenURI(newItemId));

        signatureUsed[signature] = true;
    }

    struct mintMetadata {
        TimeType ttype;
        uint256 year;
        uint256 timeUnit; //half (1,2), quarter (1-4), month (1-12) depends on TimeType
        bool isAllTime;
        uint256 rank;
        bytes32 hash;
        bytes signature;
    }

    function mintMulti(
        address _toAddress,
        mintMetadata[] memory mintMetadataList
    ) public onlyOwner {
        for (uint256 i = 0; i < mintMetadataList.length; i++) {
            require(
                recoverSigner(
                    mintMetadataList[i].hash,
                    mintMetadataList[i].signature
                ) == owner(),
                "Address is not allowlisted"
            );
            require(
                !signatureUsed[mintMetadataList[i].signature],
                iToHex(mintMetadataList[i].signature)
            );
            _tokenIds.increment();
            uint256 newItemId = _tokenIds.current();
            _safeMint(_toAddress, newItemId);
            tokenIdtoMetaData[newItemId] = tokenMetaData(
                mintMetadataList[i].ttype,
                mintMetadataList[i].year,
                mintMetadataList[i].timeUnit,
                mintMetadataList[i].isAllTime,
                mintMetadataList[i].rank
            );
            _setTokenURI(newItemId, getTokenURI(newItemId));
            signatureUsed[mintMetadataList[i].signature] = true;
        }
    }

    function iToHex(bytes memory buffer) public pure returns (string memory) {
        // Fixed buffer size for hexadecimal convertion
        bytes memory converted = new bytes(buffer.length * 2);

        bytes memory _base = "0123456789abcdef";

        for (uint256 i = 0; i < buffer.length; i++) {
            converted[i * 2] = _base[uint8(buffer[i]) / _base.length];
            converted[i * 2 + 1] = _base[uint8(buffer[i]) % _base.length];
        }

        return string(abi.encodePacked("0x", converted));
    }
}
