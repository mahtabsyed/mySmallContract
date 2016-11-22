pragma solidity ^0.4.2;

import "ConvertLib.sol";

//TODO 

contract FiftyFiftyCoin {
	mapping (address => uint) balances;

	event Transfer(address indexed _from, address indexed _to1, address indexed _to2, uint256 _value);

	function FiftyFiftyCoin() {
		balances[tx.origin] = 100000;
	}

	function sendCoin(address receiver1, address receiver2, uint amount) returns(bool sufficient) {
		if (balances[msg.sender] < amount) return false;
		balances[msg.sender] -= amount;
		balances[receiver1] += amount/2;
		balances[receiver2] += amount/2;
		Transfer(msg.sender, receiver1, receiver2, amount);
		return true;
	}

	function getBalanceInEth(address addr) returns(uint){
		return ConvertLib.convert(getBalance(addr),2);
	}

	function getBalance(address addr) returns(uint) {
		return balances[addr];
	}
}
