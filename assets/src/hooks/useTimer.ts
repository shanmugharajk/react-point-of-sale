import { useState, useEffect } from "react";
import mockApi from "../libs/mockApi";

export default function userTimer(id: string) {
  const [time, setTime] = useState(new Date().toString());
  const { subscribe, unSubscribe } = mockApi(id, handleTimeChange);

  function handleTimeChange(time: string) {
    setTime(time);
  }

  useEffect(() => {
    subscribe();

    return () => {
      unSubscribe();
    };
  });

  return [subscribe, unSubscribe, time];
}
