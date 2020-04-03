import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import lottery from './lottery';
import web3 from './web3';

class App extends Component {
  state = {
    manager:'',
    players:[],
    balance:'',
    value:'',
    message:''
  };

  async componentDidMount(){
      const manager = await lottery.methods.manager().call();
      const players = await lottery.methods.getplayers().call();
      const balance = await web3.eth.getBalance();
      this.setState({manager, players, balance});
  }

  onSubmit = async (event) =>{
    event.preventDefault(event);

    const accounts = await web3.eth.getAccounts();
    this.setState({ message:'waiting for entering into lottery'});
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value,'ether')
    });

    this.setState({message:'you have entered into lottery'});

  }

  onClick = async (event) =>{
      const accounts = await web3.eth.getAccounts();
      this.setState({message:'Waiting for a transaction...'});
      await lottery.methods.pickWinner().send({
        from: accounts[0]
      });
      this.setState({message:'winner is picked'});
  }

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by { this.state.manager } </p>
        <p>There are currently {this.state.players.length} players in the Lottery
          competing for {web3.utils.fromWei(this.state.balance,'ether')} ethers!
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h2>Want to try your luck!</h2>
          <label>Enter the amount of Ether</label>
          <input
            value={this.state.value}
            onChange={event => {this.setState(value: event.target.value)}}
          />
          <button>Enter</button>
        </form>
        <hr />
        <button onClick={this.onClick}>Pick a Winner!</button>

        <hr />
        <p>{this.state.message}</p>
      </div>
    );
  }
}

export default App;
