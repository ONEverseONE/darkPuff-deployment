//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "./Interfaces/IVoucherIncubator.sol";

contract Puffs is ERC721Enumerable,Ownable{
    IERC20 Grav;

    uint[2] public PRICE = [50 ether,1000 ether];

    bool public publicMintActive;

    uint public MAX_SUPPLY = 5555;

    string public base;

    mapping(uint=>uint) public hatchProgress;
    mapping(address=>bool) public approvedAddress;

    constructor(address _grav) ERC721("OneVerse Puffs","OVPUFF"){
        Grav = IERC20(_grav);
    }

    function publicMint(uint amount,bool payEth) external payable{
        require(publicMintActive,"OV: Public mints not active");
        require(totalSupply() + amount <= MAX_SUPPLY,"OV: Supply exceeded");
        if(payEth){
            require(msg.value == PRICE[0]*amount,"OV: Inaccurate payment");
        }
        else{
            require(msg.value == 0,"OV: Multipay");
            Grav.transferFrom(msg.sender,address(this),PRICE[1]*amount);
        }
        uint token = totalSupply();
        for(uint i = 0;i<amount;i++){
            _mint(msg.sender,token + i + 1);
        }
    }

    function setHatchProgress(uint token,uint progress) external {
        require(approvedAddress[msg.sender],"OV: Sender not approved");
        hatchProgress[token] = progress;
    }

    function _baseURI() internal view override returns (string memory) {
        return base;
    }

    function approveAddress(address _toApprove,bool _isApproved) external onlyOwner{
        approvedAddress[_toApprove] = _isApproved;
    }
        
    function setBase(string memory _base) external onlyOwner{
        base = _base;
    }

    function setPrice(uint[2] memory price) external onlyOwner{
        PRICE = price;
    }

    function setGrav(address _grav) external onlyOwner{
        Grav = IERC20(_grav);
    }

    function setPublicMintActive(bool _active) external onlyOwner{
        publicMintActive = _active;
    }

    function withdraw() external onlyOwner{
        (bool sent,) = payable(owner()).call{value:address(this).balance}("");
        require(sent,"Transfer failed");
    }

    function withdrawToken() external onlyOwner{
        Grav.transfer(owner(),Grav.balanceOf(address(this)));
    }

}