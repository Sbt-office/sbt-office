import React from "react";
import Socket from "./Socket";
import LineChart from "./Chart/LineChart";

const RoomCondition = ({ conditionRef }) => {
  return (
    <div
      ref={conditionRef}
      className="absolute top-4 left-4 px-2 py-4 z-50 bg-white/75 text-black flex flex-col gap-4 rounded-lg overflow-hidden backdrop-blur-sm text-nowrap"
    >
      <div className="font-bold px-2">Green_01</div>
      <table>
        <tbody>
          {/* {tableData.map((item, idx) => (
            <tr key={"tr" + idx}>
              <td className="px-2 py-1">{item.name}</td>
              <td className="px-2 py-1">{item.value}</td>
            </tr>
          ))} */}
          <tr>
            <td className="px-2 py-1">
              <LineChart type={"온도"} />
            </td>
            <td className="px-2 py-1">
              <LineChart type={"습도"} />
            </td>
          </tr>
          <tr>
            <td className="px-2 py-1">
              <LineChart type={"이산화탄소"} />
            </td>
            <td className="px-2 py-1">
              <LineChart type={"거리센서"} />
            </td>
          </tr>
        </tbody>
      </table>
      <Socket />
    </div>
  );
};

export default RoomCondition;
