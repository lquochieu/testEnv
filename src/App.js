import "./App.css";
import { createRef, useEffect, useState } from "react";
import {
  StartLottery,
  getStatus,
  getEntranceFee,
  enterLottery,
} from "./Web3Client.js";

function App() {
  const [status, setStatus] = useState(3);
  const [entraceFee, setEntraceFee] = useState();
  const [entered, setEntered] = useState(true);
  const nETH = createRef();
  const states = {
    lotteryState: ["Openning", "Closed", "Calculating winner", ""],
  };
  useEffect( () => {
    async function getData() {
      setStatus(await getStatus());
      setEntraceFee(await getEntranceFee());
    };
    getData();
  }, []);

  const start = async () => {
    await StartLottery()
      .then((tx) => {
        console.log(tx);
      })
      .catch((err) => {
        <div>You can't start Lottery. Please wait owner start Lottery</div>;
        console.log(err);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ETH = nETH.current.value;
    if (ETH < entraceFee) {
      setEntered(false);
    } else {
      setEntered(true);
      await enterLottery(ETH)
        .then((tx) => {
          console.log(tx);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <div className="App">
      <h1>Welcome to my Lottery</h1>
      <button disabled={status !== 1} onClick={() => start()}>
        Start
      </button>
      {status !== 3 ? (
        <div>
          <p>Lottery is {`${states.lotteryState[status]}`}</p>
          <p>Entrance fee: {`${entraceFee}`} ETH</p>
        </div>
      ) : (
        <p>Please wait!</p>
      )}
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          ref={nETH}
          id="enter"
          type="number"
          step="any"
          placeholder="Enter your ETH!"
          autoFocus
        />
        <span> </span>
        <button type="submit">Enter</button>
      </form>
      {!entered ? (
        <div>Please enter enter fee greater or equal Entrance Fee</div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default App;
