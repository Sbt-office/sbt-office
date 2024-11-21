import React, { useEffect, useRef } from "react";
import io from "socket.io-client";
import useSocketStore from "../store/socketStore";

const Socket = () => {
  const socketRef = useRef();

  const { setData, setIsConnected } = useSocketStore();

  // useEffect(() => {
  //   const socketConnection = async () => {
  //     socketRef.current = await io.connect("http://192.168.0.75:3000", { transports: ["websocket"] });
  //     socketRef.current.on("kafkaMessage", (data) => {
  //       console.log(data);
  //       // setData(data);
  //     });

  //     socketRef.current.on("connect", () => {
  //       console.log("connect");
  //       // setIsConnected(true);
  //     });

  //     socketRef.current.on("disconnect", () => {
  //       console.log("disconnect");
  //       socketRef.current = null;
  //       // setIsConnected(false);
  //     });
  //   };

  //   if (!socketRef.current) {
  //     socketConnection();
  //   }

  //   return () => {
  //     if (socketRef.current) {
  //       socketRef.current.disconnect();
  //       socketRef.current = null;
  //     }
  //   };
  // }, []);

  useEffect(() => {
    const socketConnection = async () => {
      socketRef.current = await io.connect(window.location.origin);
      socketRef.current.on("kafka", (data) => {
        setData(data);
      });

      socketRef.current.on("connect", () => {
        console.log("connect");
        setIsConnected(true);
      });

      socketRef.current.on("disconnect", () => {
        console.log("disconnect");
        setIsConnected(false);
        socketRef.current = null;
      });
    };

    if (!socketRef.current) {
      socketConnection();
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
