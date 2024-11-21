import React, { useEffect, useRef } from "react";
import io from "socket.io-client";
import useSocketStore from "../store/socketStore";
import dayjs from "dayjs";
import { HubConnectionBuilder } from "@microsoft/signalr";

const Socket = () => {
  const socketRef = useRef();

  const { setCo2, setTemp, setHumidity, setDist, setIsConnected } = useSocketStore();
  const TopicCo2 = import.meta.env.VITE_TOPIC_CO2;
  const TopicTemp = import.meta.env.VITE_TOPIC_TEMP;
  const TopicDist = import.meta.env.VITE_TOPIC_DIST;

  // useEffect(() => {
  //   const socketConnection = async () => {
  //     socketRef.current = await io.connect("http://192.168.0.75:3000", { transports: ["websocket", "polling"] });
  //     socketRef.current.on("kafkaMessage", (data) => {
  //       console.log(data);

  //       const now = dayjs().format("YYYY-MM-DD HH:mm:ss:SS");
  //       if (data[TopicCo2]) {
  //         setCo2({ time: now, value: data[TopicCo2].split(": ")[1] });
  //       } else if (data[TopicTemp]) {
  //         const split = data[TopicTemp].split(", ");
  //         setTemp({ time: now, value: split[0].split(": ")[1] });
  //         setHumidity({ time: now, value: split[1].split(": ")[1] });
  //       } else if (data[TopicDist]) {
  //         setDist({ time: now, value: data[TopicDist].split(": ")[1] });
  //       }
  //     });

  //     socketRef.current.on("connect", () => {
  //       console.log("connect");
  //     });

  //     socketRef.current.on("disconnect", () => {
  //       console.log("disconnect");
  //     });
  //   };

  //   if (!socketRef.current) {
  //     // socketConnection();
  //   }

  //   return () => {
  //     if (socketRef.current) {
  //       socketRef.current.disconnect();
  //       socketRef.current = null;
  //     }
  //   };
  // }, []);

  useEffect(() => {
    const signalRConnect = () => {
      socketRef.current = new HubConnectionBuilder()
        .withUrl("http://192.168.0.72:5222/iot", {
          timeout: 5000,
          // transport: 1,
        })
        .build();

      socketRef.current.on(TopicCo2, (data) => console.log(data));
      socketRef.current.on(TopicTemp, (data) => console.log(data));
      socketRef.current.on(TopicDist, (data) => console.log(data));

      console.log("connect");
      socketRef.current
        .start()
        .then(() => console.log("connected"))
        .catch((err) => console.error(err));
    };

    if (!socketRef.current) signalRConnect();

    return () => {
      if (socketRef.current) {
        console.log("disconnect");
        socketRef.current.stop();
        socketRef.current = null;
      }
    };
  }, []);

  return <></>;
};

export default Socket;
