/* eslint-disable react/prop-types */
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
              <LineChart title={"온도"} type="temp" />
            </td>
            <td className="px-2 py-2">
              <LineChart title={"습도"} type="humidity" />
            </td>
          </tr>
          <tr>
            <td className="px-2 py-2">
              <LineChart title={"이산화탄소"} type="co2" />
            </td>
            <td className="px-2 py-2">
              <LineChart title={"거리센서"} type="dist" />
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
