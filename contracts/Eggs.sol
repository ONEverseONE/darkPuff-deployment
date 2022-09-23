//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "./Interfaces/IWhitelist.sol";

contract Eggs is ERC721Enumerable,Ownable{

    IERC721 FreeMintVoucher;
    IWhitelist WLVoucher;
    IERC20 Grav;

    uint[2] public PRICE = [1 ether,2000 ether];
    uint[2] public WLPRICE = [1 ether,1000 ether];

    bool public freeMintActive;
    bool public wlMintActive;
    bool public publicMintActive;

    uint public MAX_SUPPLY = 5555;

    string public base;

    constructor() ERC721("OneVerse Eggs","OVEGG"){}

    function freeMint(uint[] memory tokens) external {
        require(freeMintActive,"OV: Free mints not active");
        require(totalSupply()+tokens.length <= MAX_SUPPLY,"OV: Supply exceeded");
        uint token = totalSupply();
        for(uint i=0;i<tokens.length;i++){
            FreeMintVoucher.transferFrom(msg.sender,address(this),tokens[i]);
            _mint(msg.sender,token + i + 1);
        }
    }

    function wlMint(uint[] memory tokens,bool payEth) external payable{
        require(wlMintActive,"OV: WL mints not active");
        uint amount = 0;
        for(uint i=0;i<tokens.length;i++){
            WLVoucher.transferFrom(msg.sender, address(this), tokens[i]);
            amount += WLVoucher.checkRedeemableEggs(tokens[i]);
        }
        uint token = totalSupply();
        require(token + amount <= MAX_SUPPLY,"OV: Supply exceeded");
        if(payEth){
            require(msg.value == WLPRICE[0]*amount,"OV: Inaccurate payment");
        }
        else{
            require(msg.value == 0,"OV: Multipay");
            Grav.transferFrom(msg.sender,address(this),WLPRICE[1]*amount);
        }
        for(uint j=0;j<amount;j++){
            _mint(msg.sender,token + j + 1);
        }
    }

    function publicMint(uint amount,bool payEth) external payable{
        require(publicMintActive,"OV: Public mints not active");
        require(totalSupply() + amount <= MAX_SUPPLY,"OV: Supply exceeded");
        if(payEth){
            require(msg.value == PRICE[0],"OV: Inaccurate payment");
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

    function _baseURI() internal view override returns (string memory) {
        return base;
    }

    function setBase(string memory _base) external onlyOwner{
        base = _base;
    }

    function setWLPrice(uint[2] memory wlprice) external onlyOwner{
        WLPRICE = wlprice;
    }

    function setPrice(uint[2] memory price) external onlyOwner{
        PRICE = price;
    }

    function setFreeMintActive(bool _active) external onlyOwner{
        freeMintActive = _active;
    }

    function setWLMintActive(bool _active) external onlyOwner{
        wlMintActive = _active;
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