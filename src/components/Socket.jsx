import { useEffect, useRef } from "react";
// import io from "socket.io-client";
import useSocketStore from "../store/socketStore";
import dayjs from "dayjs";
import { HubConnectionBuilder } from "@microsoft/signalr";

const Socket = () => {
  const socketRef = useRef();
  // const socketRef2 = useRef();

  const setCo2 = useSocketStore((state) => state.setCo2);
  const setTemp = useSocketStore((state) => state.setTemp);
  const setHumidity = useSocketStore((state) => state.setHumidity);
  const setDist = useSocketStore((state) => state.setDist);

  const TopicCo2 = import.meta.env.VITE_TOPIC_CO2;
  const TopicTemp = import.meta.env.VITE_TOPIC_TEMP;
  const TopicDist = import.meta.env.VITE_TOPIC_DIST;

  // useEffect(() => {
  //   const socketConnection = async () => {
  //     socketRef2.current = await io.connect("http://192.168.0.51:3001");

  //     socketRef2.current.on(TopicCo2, (data) => {
  //       const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
  //       setCo2({ time: now, value: data.split(": ")[1] });
  //     });
  //     socketRef2.current.on(TopicTemp, (data) => {
  //       const split = data.split(", ");
  //       const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
  //       setTemp({ time: now, value: split[0].split(": ")[1] });
  //       setHumidity({ time: now, value: split[1].split(": ")[1] });
  //     });
  //     socketRef2.current.on(TopicDist, (data) => {
  //       const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
  //       setDist({ time: now, value: data.split(": ")[1] });
  //     });

  //     socketRef2.current.on("connect", () => {
  //       console.log("connect");
  //     });

  //     socketRef2.current.on("disconnect", () => {
  //       console.log("disconnect");
  //     });
  //   };

  //   if (!socketRef2.current) {
  //     socketConnection();
  //   }

  //   return () => {
  //     if (socketRef2.current) {
  //       socketRef2.current.disconnect();
  //       socketRef2.current = null;
  //     }
  //   };
  // }, []);

  useEffect(() => {
    const signalRConnect = () => {
      socketRef.current = new HubConnectionBuilder()
        .withUrl("http://121.135.139.34:5000/iot", {
          timeout: 5000,
          transport: 1,
        })
        .build();

      socketRef.current.on(TopicCo2, (data) => {
        const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
        setCo2({ time: now, value: data.split(": ")[1] });
      });
      socketRef.current.on(TopicTemp, (data) => {
        const split = data.split(", ");
        const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
        setTemp({ time: now, value: split[0].split(": ")[1] });
        setHumidity({ time: now, value: split[1].split(": ")[1] });
      });
      socketRef.current.on(TopicDist, (data) => {
        const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
        setDist({ time: now, value: data.split(": ")[1] });
      });

      socketRef.current
        .start()
        .then(() => console.log("connected"))
        .catch((err) => console.error(err));
    };

    if (!socketRef.current) signalRConnect();

    return () => {
      if (socketRef.current) {
        socketRef.current.stop();
        socketRef.current = null;
      }
    };
  }, []);

  return <></>;
};

export default Socket;
