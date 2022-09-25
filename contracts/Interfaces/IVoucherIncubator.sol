//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/interfaces/IERC721.sol";

interface IVoucherIncubators is IERC721{
    function giveVoucherIncubator(uint256 _amountOfTickets, address _receiver)
        external;
}