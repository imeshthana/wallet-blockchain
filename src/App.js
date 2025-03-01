// import { useEffect, useState } from "react";
// import "./App.css";
// import { ethers, formatUnits } from "ethers";
// import { address } from "./constants/contractAddress";
// import DaiToken from "./abis/DaiToken.json";

// function App() {
//   const url = "http://127.0.0.1:8545";
//   const privateKey =
//     "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

//   const [contract, setContract] = useState(null);
//   const [provider, setProvider] = useState(null);
//   const [signer, setSigner] = useState(null);
//   const [account, setAccount] = useState(null);
//   const [balance, setBalance] = useState(0);
//   const [transactions, setTransactions] = useState([]);
//   const [amount, setAmount] = useState();
//   const [sender, setSender] = useState("");

//   const initializeProvider = async () => {
//     try {
//       const provider = new ethers.JsonRpcProvider(url);
//       console.log(provider);
//       setProvider(provider);
//       return provider;
//     } catch (error) {
//       console.error("Failed to initialize provider:", error);
//     }
//   };

//   const connectAccount = async (provider) => {
//     try {
//       if (!provider || !privateKey) return null;

//       const wallet = new ethers.Wallet(privateKey, provider);
//       const address = await wallet.getAddress();

//       setAccount(address);
//       setSigner(wallet);
//       console.log("Connected account:", address);
//       return wallet;
//     } catch (error) {
//       console.error("Failed to connect account:", error);
//       return null;
//     }
//   };

//   const loadBlockchainData = async () => {
//     if (!provider || !account || !signer) return;

//     const daiContract = new ethers.Contract(address, DaiToken, signer);
//     setContract(daiContract);

//     const balance = await daiContract.balanceOf(account);
//     setBalance(formatUnits(balance, 8));

//     const filterSent = daiContract.filters.Transfer(account, null);

//     const sentLogs = await provider.getLogs({
//       fromBlock: 0,
//       toBlock: "latest",
//       address: address,
//       topics: filterSent.topics,
//     });

//     const parsedTransactions = [...sentLogs].map((log) => {
//       const parsedLog = daiContract.interface.parseLog(log);
//       return {
//         from: parsedLog.args[0],
//         to: parsedLog.args[1],
//         value: formatUnits(parsedLog.args[2], 8),
//       };
//     });

//     setTransactions(parsedTransactions);
//     console.log("transactions", parsedTransactions);
//   };

//   useEffect(() => {
//     const init = async () => {
//       const provider = await initializeProvider();
//       if (provider && privateKey) {
//         await connectAccount(provider);
//       }
//     };

//     init();
//   }, []);

//   useEffect(() => {
//     if (provider && account && signer) {
//       loadBlockchainData();
//     }
//   }, [provider, account, signer]);

//   const handleAddressChange = async (event) => {
//     setSender(event.target.value);
//   };

//   const handleAmountChange = async (event) => {
//     setAmount(event.target.value);
//   };

//   const sendDai = async (event) => {
//     event.preventDefault();

//     if (!contract) {
//       alert("Contract not initialized");
//       return;
//     }

//     if (sender === "" || amount === 0) {
//       alert("Please enter a valid address and amount");
//       return;
//     }

//     try {
//       const amountInTokenUnits = ethers.parseUnits(amount.toString(), 8);

//       const tx = await contract.transfer(sender, amountInTokenUnits);
//       await tx.wait();

//       alert("Transfer Successful!");

//       loadBlockchainData();

//       setAmount("");
//       setSender("");
//     } catch (error) {
//       alert("Transfer Failed!");
//       console.error(error);
//     }
//   };

//   return (
//     <div className="App">
//       <h1>Dai Token Wallet</h1>
//       <hr />
//       <h3>Balance: {balance} DAI</h3>
//       <hr />
//       <h3>Send DAI</h3>
//       <form onSubmit={sendDai}>
//         <input
//           type="text"
//           name="address"
//           placeholder="Enter the reciever's address"
//           value={sender}
//           onChange={handleAddressChange}
//         />
//         <input
//           type="text"
//           name="amount"
//           placeholder="Enter the amount"
//           value={amount}
//           onChange={handleAmountChange}
//         />
//         <input type="submit" value="Send" />
//       </form>
//       <hr />
//       <table className="table">
//         <thead>
//           <tr>
//             <th scope="col">Sender</th>
//             <th scope="col">Recipient</th>
//             <th scope="col">value</th>
//           </tr>
//         </thead>
//         <tbody>
//           {transactions.map((tx, key) => {
//             return (
//               <tr key={key}>
//                 <td>{tx.from}</td>
//                 <td>{tx.to}</td>
//                 <td>{tx.value}</td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default App;

import { useEffect, useState } from "react";
import "./App.css";
import { ethers, formatUnits } from "ethers";
import { address } from "./constants/contractAddress";
import DaiToken from "./abis/DaiToken.json";

function App() {
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState();
  const [sender, setSender] = useState("");

  const [privateKey, setPrivateKey] = useState("");
  const rpcUrl = "http://127.0.0.1:8545";

  const initializeProvider = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      setProvider(provider);
      return provider;
    } catch (error) {
      console.error("Failed to initialize provider:", error);
    }
  };

  const connectAccount = async (provider) => {
    try {
      if (!provider || !privateKey) return null;

      const wallet = new ethers.Wallet(privateKey, provider);
      const address = await wallet.getAddress();

      setAccount(address);
      setSigner(wallet);
      console.log("Connected account:", address);
      return wallet;
    } catch (error) {
      console.error("Failed to connect account:", error);
      return null;
    }
  };

  const loadBlockchainData = async () => {
    if (!provider || !account || !signer) return;

    try {
      const daiContract = new ethers.Contract(address, DaiToken, signer);
      setContract(daiContract);

      const balance = await daiContract.balanceOf(account);
      setBalance(formatUnits(balance, 8));

      const filterSent = daiContract.filters.Transfer(account, null);

      const sentLogs = await provider.getLogs({
        fromBlock: 0,
        toBlock: "latest",
        address: address,
        topics: filterSent.topics,
      });

      const parsedTransactions = [...sentLogs].map((log) => {
        const parsedLog = daiContract.interface.parseLog(log);
        return {
          from: parsedLog.args[0],
          to: parsedLog.args[1],
          value: formatUnits(parsedLog.args[2], 8),
        };
      });

      setTransactions(parsedTransactions);
      console.log("transactions", parsedTransactions);
    } catch (error) {
      console.error("Failed to load blockchain data:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      const provider = await initializeProvider();
      if (provider && privateKey) {
        await connectAccount(provider);
      }
    };

    init();
  }, [privateKey, rpcUrl]);

  useEffect(() => {
    if (provider && account && signer) {
      loadBlockchainData();
    }
  }, [provider, account, signer]);

  const handleAddressChange = (event) => {
    setSender(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handlePrivateKeyChange = (event) => {
    setPrivateKey(event.target.value);
  };

  const sendDai = async (event) => {
    event.preventDefault();

    if (!contract) {
      alert("Contract not initialized");
      return;
    }

    if (sender === "" || !amount) {
      alert("Please enter a valid address and amount");
      return;
    }

    try {
      const amountInTokenUnits = ethers.parseUnits(amount.toString(), 8);

      // This will sign and send the transaction automatically using the private key
      const tx = await contract.transfer(sender, amountInTokenUnits);
      await tx.wait();

      alert("Transfer Successful!");

      loadBlockchainData();

      setAmount("");
      setSender("");
    } catch (error) {
      alert("Transfer Failed!");
      console.error(error);
    }
  };

  return (
    <div className="App">
      <h1>Dai Token Wallet</h1>
      <hr />

      {!account && (
        <div className="setup-section">
          <h3>Login to Wallet</h3>
          <div>
            <input
              type="password"
              placeholder="Enter your private key"
              value={privateKey}
              onChange={handlePrivateKeyChange}
              className="setup-input"
            />
          </div>
        </div>
      )}

      {account && (
        <>
          <p>Connected Account: {account}</p>
          <h3>Balance: {balance} DAI</h3>
          <hr />
          <h3>Send DAI</h3>
          <form onSubmit={sendDai}>
            <input
              type="text"
              name="address"
              placeholder="Enter the receiver's address"
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
                <th scope="col">Sender</th>
                <th scope="col">Recipient</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, key) => {
                return (
                  <tr key={key}>
                    <td>{tx.from}</td>
                    <td>{tx.to}</td>
                    <td>{tx.value}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default App;
