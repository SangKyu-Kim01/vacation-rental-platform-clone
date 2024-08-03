import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useGetMyUser } from "../api/UserApi";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const { currentUser } = useGetMyUser();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(io(`${process.env.REACT_APP_API_BASE_URL}`));
  }, []);

  useEffect(() => {
    currentUser && socket?.emit("newUser", currentUser.id);
  }, [currentUser, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
