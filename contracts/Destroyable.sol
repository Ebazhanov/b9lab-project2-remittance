pragma solidity ^0.4.4;

import "./Ownable.sol";

contract Destroyable is Ownable {

    function destroy() onlyOwner public {
        selfdestruct(owner);
    }
}