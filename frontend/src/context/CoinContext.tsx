import React, { createContext, useState, useEffect, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

// Optional: define types for your real-time data
interface RealTimeData {
  price: number | null;
}

interface CoinContextType {
  socket: Socket | null;
  realTimeData: RealTimeData;
}

export const CoinContext = createContext<CoinContextType>({
  socket: null,
  realTimeData: { price: null }
});

interface CoinContextProviderProps {
  children: ReactNode;
}

const CoinContextProvider: React.FC<CoinContextProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [realTimeData, setRealTimeData] = useState<RealTimeData>({ price: null });

  useEffect(() => {
    const newSocket = io("http://localhost:4000"); // Update to your backend URL
    setSocket(newSocket);

    newSocket.on("btcPrice", (price: number) => {
      setRealTimeData({ price });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <CoinContext.Provider value={{ socket, realTimeData }}>
      {children}
    </CoinContext.Provider>
  );
};

export default CoinContextProvider;
