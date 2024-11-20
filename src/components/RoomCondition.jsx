import React from "react";
import useSocketStore from "../store/socketStore";
import Socket from "./Socket";

const RoomCondition = ({ conditionRef }) => {
  const { co2, temp, humidity, dist } = useSocketStore();

  const convertDistance = (distance) => {
    if (dist > 1000) return (dist / 1000).toFixed(2) + " m";
    else if (dist > 10) return (dist / 10).toFixed(2) + " cm";
    else return dist + " mm";
  };

  const tableData = [
    {
      name: "이산화탄소",
      value: co2 + " ppm",
    },
    {
      name: "온도",
      value: temp + " °C",
    },
    {
      name: "습도",
      value: humidity + " %",
    },
    {
      name: "거리센서",
      value: convertDistance(dist),
    },
  ];

  return (
    <div
      ref={conditionRef}
      className="absolute top-4 left-4 px-2 py-2 bg-white/75 text-black flex flex-col gap-4 rounded-lg overflow-hidden backdrop-blur-sm text-nowrap"
    >
      <div className="font-bold">Green_01</div>
      <table>
        <tbody>
          {tableData.map((item, idx) => (
            <tr key={"tr" + idx}>
              <td className="px-2 py-1">{item.name}</td>
              <td className="px-2 py-1">{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Socket />
    </div>
  );
};

export default RoomCondition;
