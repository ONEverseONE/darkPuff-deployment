//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/interfaces/IERC721.sol";

interface IWhitelist is IERC721{
    function checkRedeemableEggs(uint256 _tokenId)
        external
        view
        returns (uint256);
}