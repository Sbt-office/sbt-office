import React from "react";
import Socket from "./Socket";
import LineChart from "./Chart/LineChart";
import { CloseButton } from "../utils/icon";

const RoomCondition = ({ conditionRef, closeEvent }) => {
  return (
    <div
      ref={conditionRef}
      className="absolute top-4 left-4 px-2 py-2 z-50 bg-white/75 text-black flex flex-col gap-2 rounded-lg overflow-hidden backdrop-blur-sm text-nowrap"
    >
      <div className="font-bold px-2">Green_01</div>
      <table>
        <tbody>
          <tr>
            <td className="px-2 py-2">
              <LineChart type={"온도"} />
            </td>
            <td className="px-2 py-2">
              <LineChart type={"습도"} />
            </td>
          </tr>
          <tr>
            <td className="px-2 py-2">
              <LineChart type={"이산화탄소"} />
            </td>
            <td className="px-2 py-2">
              <LineChart type={"거리센서"} />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="absolute top-2 right-2">
        <CloseButton closeEvent={closeEvent} />
      </div>
      <Socket />
    </div>
  );
};

export default RoomCondition;
