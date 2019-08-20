import React, {Component} from 'react'
import * as services from './config/contract-services'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

var contractInstance;
var userList;
var web3Instance;

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            storageValue: 0,
            web3: null
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }


    async componentWillMount() {

        web3Instance = await  services.initWeb3();
        contractInstance = await  services.getContract(web3Instance);
        userList = await  services.getAccounts(web3Instance);
        this.updateBalance();
        //await this.getAccounts();
    }




    async updateBalance() {
        this.setState({storageValue: await services.getContractTokenBalance(contractInstance, userList[0])});
    }

    async handleSubmit(event) {
        event.preventDefault();

        await  services.payFunct(contractInstance, this.state.value, userList[0]);
        this.updateBalance();
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    returnMoney() {
        services.returnMoney(contractInstance, userList[0]);
        this.updateBalance();
    }
    reckoningMoney() {
        services.reckoningFunct('Qwerty1','Qwerty2',contractInstance, userList[0]);
        this.updateBalance();
    }




    async destroy() {
        await  services.destroyContract(contractInstance, userList[0]);
    }

    render() {


        return (
            <div className="App">


                <main className="container">
                    <div className="pure-g">
                        <div className="pure-u-1-1">
                            <h1>Splitter application</h1>
                            <form onSubmit={this.handleSubmit}>
                                <label>
                                    Send money to contract:
                                    <input type="number" value={this.state.value} onChange={this.handleChange}/>
                                </label>
                                <input type="submit" value="Submit"/>

                            </form>
                            <button onClick={this.returnMoney.bind(this)}>Return Money</button><br/>

                            <button onClick={this.reckoningMoney.bind(this)}>Send tokens</button>
                            <button onClick={this.destroy.bind(this)}>Destroy Contract</button>

                            <h2>Current contract balance is: {this.state.storageValue}</h2>

                        </div>
                    </div>
                </main>
            </div>
        );
    }
}

export default App
