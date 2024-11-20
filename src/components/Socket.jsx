import React, { useEffect, useRef } from "react";
import io from "socket.io-client";
import useSocketStore from "../store/socketStore";

const Socket = () => {
  const socketRef = useRef();

  const { setData } = useSocketStore();

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io.connect(window.location.origin);
      socketRef.current.on("kafka", setData);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return <></>;
};

export default Socket;
