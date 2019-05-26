import React from "react";
import userTimer from "../../hooks/useTimer";

function Timer() {
  const [subscribe, unSubscribe, time] = userTimer("shan");

  return (
    <div>
      <h4>{time.toString()}</h4>
      <br />

      <button onClick={subscribe as any}>Subscribe</button>
      <br />
      <br />
      <button onClick={unSubscribe as any}>Un-Subscribe</button>
    </div>
  );
}

export default Timer;
