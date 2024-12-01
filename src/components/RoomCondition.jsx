/* eslint-disable react/prop-types */
import Socket from "./Socket";
import useSocketStore from "@/store/socketStore";
import useDoorStore from "@/store/doorStore";
import {
  co2Color,
  co2Messages,
  humidityColor,
  humidityMessage,
  tempMessage,
  tempColor,
  doorMessage,
} from "@/data/IotConditionStatus";
import { useEffect } from "react";

const TableRow = ({ color, label, value, message, unit = "" }) => (
  <tr className="cursor-pointer hover:font-bold">
    <td>{color && <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }}></div>}</td>
    <td>
      <div>{label}</div>
    </td>
    <td>
      {value && (
        <div>
          {value} {unit}
        </div>
      )}
    </td>
    <td>
      <div>{message}</div>
    </td>
  </tr>
);

const RoomCondition = ({ conditionRef }) => {
  const { getData } = useSocketStore();
  const { setDoorIdx } = useDoorStore();

  const temp = getData("temp").value;
  const tempIdx = temp < 17 ? 0 : temp < 22 ? 2 : temp < 26 ? 1 : 3;

  const humidity = getData("humidity").value;
  const humidityIdx = humidity < 20 ? 0 : humidity < 40 ? 1 : humidity < 60 ? 2 : humidity < 80 ? 4 : 5;

  const co2 = getData("co2").value;
  const co2Idx = co2 < 600 ? 0 : co2 < 800 ? 1 : co2 < 1000 ? 2 : co2 < 1500 ? 3 : 4;

  const doorOpenStatue = getData("dist").value;
  const doorIdx = doorOpenStatue <= 101 ? 2 : doorOpenStatue <= 120 ? 0 : doorOpenStatue <= 130 ? 1 : 2;

  useEffect(() => {
    setDoorIdx(doorIdx);
  }, [doorIdx, setDoorIdx]);

  return (
    <div
      ref={conditionRef}
      className="absolute px-2 py-2 z-50 bg-white text-black flex flex-col gap-2 overflow-hidden text-nowrap"
    >
      <div className="font-bold px-2">Green_01</div>
      <table className="border-separate border-spacing-4">
        <tbody>
          <TableRow color={tempColor[tempIdx]} label="온도" value={temp} unit="°C" message={tempMessage[tempIdx]} />
          <TableRow
            color={humidityColor[humidityIdx]}
            label="습도"
            value={humidity}
            unit="%"
            message={humidityMessage[humidityIdx]}
          />
          <TableRow color={co2Color[co2Idx]} label="CO2" value={co2} unit="ppm" message={co2Messages[co2Idx]} />
          <TableRow label="문 개폐 여부" message={doorMessage[doorIdx]} />
        </tbody>
      </table>
      <Socket />
    </div>
  );
};

export default RoomCondition;
