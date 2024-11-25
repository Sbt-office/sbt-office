/* eslint-disable react/prop-types */
import Socket from "./Socket";
import useSocketStore from "../store/socketStore";
// import LineChart from "./Chart/LineChart";
// import { CloseButton } from "../utils/icon";
// import GaugeChart from "./Chart/GaugeChart";

const RoomCondition = ({ conditionRef }) => {
  const { getData } = useSocketStore();

  // const [showDetail, setShowDetail] = useState(null);

  // const convertDist = (dist) => {
  //   if (dist > 1000) return (dist / 1000).toFixed(2) + "m";
  //   else if (dist > 10) return (dist / 10).toFixed(2) + "cm";
  //   else return dist + "mm";
  // };

  const co2Messages = [
    "매우 쾌적한 사무실 입니다.",
    "매우 쾌적한 사무실 입니다.",
    "적정한 수준, 쾌적합니다.",
    "약간 불쾌감을 줄 수 있는 수준. 환기가 필요합니다.",
    "공기질 악화. 집중력 저하, 졸음, 두통 등의 증상이 나타날 수 있습니다.",
  ];
  const co2Color = ["#00BFFF", "#00BFFF", "#7CFC00", "#FFD700", "#FF4500"];
  const tempMessage = [
    "너무 추워요. 난방의 온도를 높여 주세요.",
    "적정 실내 온도 입니다.",
    "온도가 낮습니다.",
    "온도가 너무 높습니다. 난방기를 멈춰주세요.",
  ];
  const tempColor = ["#00BFFF", "#7CFC00", "#FFD700", "#FF4500"];
  const humidityMessage = [
    "너무 건조합니다.",
    "약간 건조합니다.",
    "매우 쾌적한 사무실 입니다.",
    "약간 습합니다.",
    "너무 습합니다.",
  ];
  const humidityColor = ["#FF4500", "#FFD700", "#7CFC00", "#FFD700", "#FF4500"];
  const distMessage = ["문 열림 (안쪽)", "문 열림 (바깥)", "문 닫힘", "알 수 없음"];

  const temp = getData("temp").value;
  const tempIdx = temp < 17 ? 0 : temp < 22 ? 2 : temp < 26 ? 1 : 3;
  const humidity = getData("humidity").value;
  const humidityIdx = humidity < 20 ? 0 : humidity < 40 ? 1 : humidity < 60 ? 2 : humidity < 80 ? 4 : 5;
  const co2 = getData("co2").value;
  const co2Idx = co2 < 600 ? 0 : co2 < 800 ? 1 : co2 < 1000 ? 2 : co2 < 1500 ? 3 : 4;
  const dist = getData("dist").value;

  const checkDist = () => {
    if (dist <= 21) return 0;
    else if (dist <= 48) return 1;
    else return 2;
  };

  return (
    <div
      ref={conditionRef}
      className="absolute px-2 py-2 z-50 bg-white text-black flex flex-col gap-2 overflow-hidden text-nowrap"
    >
      <div className="font-bold px-2">Green_01</div>
      <table className="border-separate border-spacing-4">
        <tbody>
          <tr className="cursor-pointer hover:font-bold">
            <td>
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tempColor[tempIdx] }}></div>
            </td>
            <td>
              <div>온도 </div>
            </td>
            <td>
              <div>{temp} °C</div>
            </td>
            <td>
              <div>{tempMessage[tempIdx]}</div>
            </td>
          </tr>
          <tr className="cursor-pointer hover:font-bold">
            <td>
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: humidityColor[humidityIdx] }}></div>
            </td>
            <td>
              <div>습도 </div>
            </td>
            <td>
              <div>{humidity} %</div>
            </td>
            <td>
              <div>{humidityMessage[humidityIdx]}</div>
            </td>
          </tr>
          <tr className="cursor-pointer hover:font-bold">
            <td>
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: co2Color[co2Idx] }}></div>
            </td>
            <td>
              <div>이산화탄소 </div>
            </td>
            <td>
              <div>{co2} ppm</div>
            </td>
            <td>
              <div>{co2Messages[co2Idx]}</div>
            </td>
          </tr>
          <tr className="cursor-pointer hover:font-bold">
            <td></td>
            <td>
              <div>문 개폐 여부 </div>
            </td>
            <td></td>
            <td>
              <div>{distMessage[checkDist(dist)]}</div>
            </td>
          </tr>
        </tbody>
      </table>
      {/* <table>
        <tbody>
          <tr>
            <td className="px-2 py-2">
              <GaugeChart title="온도" type="temp" min={0} max={40} range={[17, 22, 26]} unit="°C" />
            </td>
            <td className="px-2 py-2">
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
      </table> */}
      {/* <div className="absolute top-2 right-2">
        <CloseButton closeEvent={closeEvent} />
      </div> */}
      <Socket />
    </div>
  );
};

export default RoomCondition;
