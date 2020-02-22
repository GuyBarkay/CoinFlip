import "./Ownable1.sol";

pragma solidity ^0.5.8;

contract Coinflip is Ownable1 {

  uint public acountBalance;


  modifier costs(uint cost){
  require(msg.value >= cost, "please send the required amount");
      _;
  }

  mapping(address => uint ) private lastFlip;
  mapping (address => uint ) private senderBalance;

  event BetTransfer(address _from, uint256 _value);
  event Deposit(address indexed _from, uint _value);



  function getBalance() public view returns (uint){
  return address(this).balance;
    }

  function getLastFlip() public view returns (uint){
      return lastFlip[msg.sender];
  }

  function random() private view returns (uint){
  return now % 2;
  }
  function getPlayerBalance() public view returns (int){
  return int(senderBalance[msg.sender]);
  }

  function toTransferBet(uint winBet) private returns(uint) {
     uint  w = winBet;
     winBet= 0;
     msg.sender.transfer(w);
     return w;
    }


   function flip () public payable costs (0.1 ether ) {
     uint bet = msg.value;
    acountBalance += bet;
    senderBalance[msg.sender] -= msg.value;



    if(random() == 0 ){
    lastFlip [msg.sender] = 1;
     uint winRatio = 3;
     uint winBet = bet*winRatio;
    acountBalance -= winBet;
    senderBalance[msg.sender] += winBet;
    toTransferBet(winBet);

    }
    else{
     lastFlip[msg.sender]= 0;
     senderBalance[msg.sender] += 0;
    }
   getLastFlip();
   getPlayerBalance();

     emit BetTransfer( msg.sender, msg.value);
     assert(address(this).balance == acountBalance);
 }


  function deposit() public onlyOwner payable  {
   acountBalance += msg.value;


   emit Deposit(msg.sender, msg.value);
  }


    function withdrawAll() public onlyOwner returns(uint) {
        uint toTransfer = acountBalance;
        acountBalance = 0;
        msg.sender.transfer(toTransfer);
        return toTransfer;
    }
}
