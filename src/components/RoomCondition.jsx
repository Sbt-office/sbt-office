/* eslint-disable react/prop-types */
import Socket from "./Socket";
import LineChart from "./Chart/LineChart";
import { CloseButton } from "../utils/icon";
import useSocketStore from "../store/socketStore";
import GaugeChart from "./Chart/GaugeChart";

const RoomCondition = ({ conditionRef, closeEvent }) => {
  const { getData } = useSocketStore();

  const convertDist = (dist) => {
    if (dist > 1000) return (dist / 1000).toFixed(2) + "m";
    else if (dist > 10) return (dist / 10).toFixed(2) + "cm";
    else return dist + "mm";
  };

  return (
    <div
      ref={conditionRef}
      className="absolute top-4 left-4 px-2 py-2 z-50 bg-white/75 text-black flex flex-col gap-2 rounded-lg overflow-hidden backdrop-blur-sm text-nowrap"
    >
      <div className="font-bold px-2">Green_01</div>
      <div className="flex gap-4">
        <div>온도: </div>
        <div>{getData("temp").value} °C</div>
      </div>
      <div className="flex gap-4">
        <div>습도: </div>
        <div>{getData("humidity").value} %</div>
      </div>
      <div className="flex gap-4">
        <div>이산화탄소: </div>
        <div>{getData("co2").value} ppm</div>
      </div>
      <div className="flex gap-4">
        <div>거리센서: </div>
        <div>{convertDist(getData("dist").value)}</div>
      </div>
      <table>
        <tbody>
          <tr>
            <td className="px-2 py-2">
              {/* <LineChart title="온도" type="temp" /> */}
              <GaugeChart title="온도" type="temp" min={0} max={40} range={[16, 21, 26]} unit="°C" />
            </td>
            <td className="px-2 py-2">
              {/* <LineChart title="습도" type="humidity" /> */}
              <GaugeChart title="습도" type="humidity" min={0} max={100} range={[30, 50, 70]} unit="%" />
            </td>
          </tr>
          <tr>
            <td className="px-2 py-2">
              <LineChart title="이산화탄소" type="co2" />
            </td>
            <td className="px-2 py-2">
              <LineChart title="거리센서" type="dist" />
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
