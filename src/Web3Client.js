import Web3 from "web3";
import lotteryContractBuild from "contracts/Lottery.json";
import addressContract from "lottery/address.json";

let selectedAccount;
let lotteryContract;
let initialize = false;
let status = null;
let entranceFee = null;
let web3;
export const init = async () => {
  web3 = await new Web3(
    "https://rinkeby.infura.io/v3/4a901a0fd16b4bba8be8a332c5762fe2"
  );
  console.log(web3);
  lotteryContract = await new web3.eth.Contract(
    lotteryContractBuild.abi,
    addressContract.lottery
  );
  try {
    status = await lotteryContract.methods.lottery_state().call();
  } catch (err) {
    console.log(err);
  }
  console.log(lotteryContract);
};

export const getAccount = async () => {
  let provider = window.ethereum;
  if (provider !== "undefined") {
    await provider
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        selectedAccount = accounts[0];
        console.log(`Selected account is ${selectedAccount}`);
      })
      .catch((err) => {
        console.log(err);
        console.log("??????????");
        return;
      });
  }

  await window.ethereum.on("accountsChanged", function (accounts) {
    selectedAccount = accounts[0];
    console.log(`Selected account change is ${selectedAccount}`);
  });
  initialize = true;
};

export const StartLottery = async () => {
  if (!initialize) {
    await getAccount();
  } else {
  }
  return await lotteryContract.methods
    .startLottery()
    .send({ from: selectedAccount });
};

export const enterLottery = async (eth) => {
  if (!initialize) {
    await getAccount();
  } else {
  }
  let fee = web3.utils.toWei(eth, "ether");
  return await lotteryContract.methods
    .enter()
    .send({ from: selectedAccount, value: fee });
};
export const getStatus = async () => {
  if (status === null) {
    await init();
  }
  return status;
};

export const getEntranceFee = async () => {
  if (status === null) {
    await getStatus();
  }
  try {
    entranceFee = await lotteryContract.methods.getEntranceFee().call();
    entranceFee = entranceFee / Math.pow(10, 18);
  } catch (err) {
    console.log(err);
    entranceFee = -1;
  }
  return entranceFee;
};
