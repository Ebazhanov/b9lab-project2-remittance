import Remittance from '../../build/contracts/Remittance.json'
import getWeb3 from '../utils/getWeb3'
import Web3 from 'web3';


export const initWeb3 = async () => {
    var web3 = window.web3
    console.log('Injected web3 detected.');
    var provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545')
    web3 = new Web3(provider)

    return web3;
}

export const getContract = async (_web3) => {
    const contract = require('truffle-contract')
    const simpleStorage = contract(Remittance)
    simpleStorage.setProvider(_web3.currentProvider)
    var simpleStorageInstance = await simpleStorage.deployed();
    return simpleStorageInstance;
}
export const getAccounts = (_web3) => {
    //  _web3.eth.getAccounts(function (err, res) {return (res);});

    return new Promise((resolve, reject) => _web3.eth.getAccounts((err, res) => resolve(res)))
}


export const payFunct = async (contractInstance, count, sender) => {
    console.log(count, sender)
    await contractInstance.payMoney({from: sender, value: count});
};
export const reckoningFunct = async (firstPassw,secondPassw,contractInstance, sender) => {
    contractInstance.reckoning(firstPassw,secondPassw, {from: sender});
};
//
export const getContractTokenBalance = async (contractInstance, sender) => {
    var balance = await contractInstance.getCurrentSubval();
    return balance.toString();
};
export const returnMoney = async (contractInstance, sender) => {
    var result = await contractInstance.cashBack( {from: sender});
    return result;
};


export const destroyContract = async (contractInstance,sender) => {
    await contractInstance.destroy({from:sender });

};

