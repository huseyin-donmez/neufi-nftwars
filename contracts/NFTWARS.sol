pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFTWARS is ERC1155 {
    // mapping for NFT id to address 
    mapping (uint => address) public idToAddressNFT;
    // mapping for NFT id to kill count so can be known how much that NFT killed 
    mapping (uint => uint) public idToKillCount;
    uint8 j = 0;
    uint randNonce = 0;
    
    constructor() ERC1155("https://ipfs.io/ipfs/bafybeifkjcbfxth7kzx3egk7wskjs3u6speqa6ztplnxtyxxinf577s7a4/{id}.json") {
    }
    /*
    Random number generator function for fight
    _modulus uint => defines the number limit using mod operation
    */
    function randMod(uint _modulus) internal returns(uint) {
        randNonce++;
        //this hash use 3 input so if any bit of them is change then whole hash will be changedd 
        return uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % _modulus;
    }
    /*
    _idNFTfrom => Fighter number one
    _idNFTto => Fighter number two
    _winner => winner
    */
    function fight(uint _idNFTfrom, uint _idNFTto) public returns (uint _winner) {
        //should not be the same nft
        require(_idNFTfrom != _idNFTto);
        //The player should own both NFTs 
        require(msg.sender == idToAddressNFT[_idNFTfrom] && msg.sender == idToAddressNFT[_idNFTto]);
        //NFTs shouldn't be burned
        require(address(0) != idToAddressNFT[_idNFTfrom] && address(0) != idToAddressNFT[_idNFTto]);
        uint rand = randMod(100);
        if (rand < 50) {
            idToKillCount[_idNFTfrom]++;
            //Loser NFT goes to OVEN:)
            _burn(msg.sender, _idNFTto, 1);
            idToAddressNFT[_idNFTto] = address(0);
            return _idNFTfrom;
        }else{
            idToKillCount[_idNFTto]++;
            _burn(msg.sender, _idNFTfrom, 1);
            idToAddressNFT[_idNFTfrom] = address(0);
            return _idNFTto;
        }
    }
    function mintNFT() public returns (uint _nftId) {
        require(j < 100);
        j++;
        _mint(msg.sender, j, 1, "");
        idToAddressNFT[j] = msg.sender;
        return j;

    }
      function uri(uint256 _tokenid) override public pure returns (string memory) {
        return string(
            abi.encodePacked(
                "https://ipfs.io/ipfs/bafybeihjjkwdrxxjnuwevlqtqmh3iegcadc32sio4wmo7bv2gbf34qs34a/",
                Strings.toString(_tokenid),".json"
            )
        );
    }
}