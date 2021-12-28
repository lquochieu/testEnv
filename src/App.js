import "./App.css";
import Web3 from "web3";
import { useEffect } from "react";
require("dotenv").config();

function App() {
  console.log(process.env.CONTRACT_ADDRESS);
  const providerUrl =
    "https://rinkeby.infura.io/v3/4a901a0fd16b4bba8be8a332c5762fe2";

  useEffect(() => {
    const web3 = new Web3(providerUrl);
    let provider = window.ethereum;
    if (typeof provider !== "underfined") {
      provider.request({ method: "eth_requestAccounts" }).then((accounts) => {
        console.log(accounts);
      }).catch((err) => {
        console.log(err);
      });
    }
  });

  return <div className="App"></div>;
}

export default App;
