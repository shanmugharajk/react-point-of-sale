import { useState } from "react";

export default function useAuth() {
  const [token, setToken] = useState("");

  const saveToken: (token: string) => void = (token: string) => {
    sessionStorage.setItem("token", token);
    setToken(token);
  };

  const deleteToken: () => void = () => {
    sessionStorage.deleteToken("token");
    setToken("");
  };

  return [token, saveToken, deleteToken];
}
