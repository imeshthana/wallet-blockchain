import { useEffect, useState } from "react";
import "./App.css";
import { ethers, formatUnits } from "ethers";
import { address } from "./constants/contractAddress";
import DaiToken from "./abis/DaiToken.json";

function App() {
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState();
  const [sender, setSender] = useState("");

  const initializeProvider = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
    }
  };

  const connectAccount = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = ethers.getAddress(accounts[0]);
      setAccount(account);
      console.log(account);
    }
  };
  const loadBlockchainData = async () => {
    if (!provider || !account) return;

    const signer = await provider.getSigner();
    const daiContract = new ethers.Contract(address, DaiToken, signer);
    setContract(daiContract);

    const balance = await daiContract.balanceOf(account);
    setBalance(formatUnits(balance, 8));

    const filterSent = daiContract.filters.Transfer(account, null);
    const filterReceived = daiContract.filters.Transfer(null, account);

    const sentLogs = await provider.getLogs({
      fromBlock: 0,
      toBlock: "latest",
      address: address,
      topics: filterSent.topics,
    });

    const receivedLogs = await provider.getLogs({
      fromBlock: 0,
      toBlock: "latest",
      address: address,
      topics: filterReceived.topics,
    });

    const parsedTransactions = [...sentLogs, ...receivedLogs].map((log) => {
      const parsedLog = daiContract.interface.parseLog(log);
      return {
        from: parsedLog.args[0],
        to: parsedLog.args[1],
        value: formatUnits(parsedLog.args[2], 8),
      };
    });

    setTransactions(parsedTransactions);
    console.log("transactions", parsedTransactions);
  };

  useEffect(() => {
    initializeProvider();
    connectAccount();
  }, []);

  useEffect(() => {
    if (provider && account) {
      loadBlockchainData();
    }
  }, [provider, account]);

  const handleAddressChange = async (event) => {
    setSender(event.target.value);
  };

  const handleAmountChange = async (event) => {
    setAmount(event.target.value);
  };

  const sendDai = async (event) => {
    event.preventDefault();

    if (!contract) {
      alert("Contract not initialized");
      return;
    }

    if (sender === "" || amount === 0) {
      alert("Please enter a valid address and amount");
      return;
    }

    try {
      const amountInTokenUnits = ethers.parseUnits(amount.toString(), 8);

      const tx = await contract.transfer(sender, amountInTokenUnits);
      await tx.wait();

      alert("Transfer Successful!");

      loadBlockchainData();

      setAmount();
      setSender();
    } catch (error) {
      alert("Transfer Failed!");
      console.error(error);
    }
  };

  return (
    <div className="App">
      <h1>Dai Token Wallet</h1>
      <hr />
      <h3>Balance: {balance} DAI</h3>
      <hr />
      <h3>Send DAI</h3>
      <form onSubmit={sendDai}>
        <input
          type="text"
          name="address"
          placeholder="Enter the reciever's address"
          value={sender}
          onChange={handleAddressChange}
        />
        <input
          type="text"
          name="amount"
          placeholder="Enter the amount"
          value={amount}
          onChange={handleAmountChange}
        />
        <input type="submit" value="Send" />
      </form>
      <hr />
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Recipient</th>
            <th scope="col">value</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, key) => {
            return (
              <tr key={key}>
                <td>{tx.to}</td>
                <td>{tx.value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
