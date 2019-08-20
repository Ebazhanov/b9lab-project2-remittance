pragma solidity ^0.4.4;


import "./Destroyable.sol";
import "./Stoppable.sol";

contract Remittance is Stoppable, Destroyable {

  mapping(bytes32 => RemmitanceData) remData;

  struct RemmitanceData {
    address owner;
    address recipient;
    uint deadline;
    uint balance;
  }


  event LogNewRemittanceData(address indexed sender, address recipien, bytes32 hashPass, uint deadline, uint balance);
  event LogClaimRemmitance(address indexed to, uint balance);
  event LogCashBack(address indexed to, uint balance);


  function setRemittanceData(uint daysAvailable, address receiver, bytes32 hashPass) public payable {

    require(daysAvailable != 0);
    require(receiver != 0);
    require(msg.value != 0);

    uint tempDeadline = now + (daysAvailable * 86400);
    require(remData[hashPass].recipient == address(0));
    remData[hashPass] = RemmitanceData({
      owner : msg.sender,
      recipient : receiver,
      deadline : tempDeadline,
      balance : msg.value
      });
    emit LogNewRemittanceData(msg.sender, receiver, hashPass, tempDeadline, msg.value);
  }


  function claimRemittance(string firstPassw) onlyIfRunning public returns (bool){
    bytes32 tempHash = hashHelper(firstPassw, msg.sender);
    RemmitanceData storage tempData = remData[tempHash];
    require(tempData.recipient != 0);
    uint tempBalance = tempData.balance;
    require(tempBalance != 0);
    remData[tempHash].balance = 0;
    emit LogClaimRemmitance(tempData.recipient, tempBalance);
    tempData.recipient.transfer(tempBalance);
    return true;

  }

  function cashBack(string firstPassw) onlyIfRunning public returns (bool success)
  {
    bytes32 tempHash = hashHelper(firstPassw, msg.sender);
    RemmitanceData storage tempData = remData[tempHash];
    uint tempBalance = tempData.balance;
    require(tempBalance != 0);
    require(tempData.owner != 0);
    require(tempData.deadline < now);
    remData[tempHash].balance = 0;
    emit LogCashBack(tempData.owner, tempBalance);
    tempData.owner.transfer(tempBalance);
    return true;
  }

  function hashHelper(string passw, address userAddr) public pure returns (bytes32 hash) {
    return keccak256(userAddr, passw);
  }

}