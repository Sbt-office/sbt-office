import React, { useEffect, useRef, useState } from "react";
import EChartsReact from "echarts-for-react";
import _ from "lodash";
import useSocketStore from "../../store/socketStore";
import dayjs from "dayjs";

const LineChart = ({ type }) => {
  const { getData } = useSocketStore();

  const chartInitRef = useRef();
  const valueRef = useRef(0);

  const [options, setOptions] = useState({});
  const [valueArray, setValueArray] = useState([]);
  const [isNodata, setIsNodata] = useState(false);

  const drawChart = () => {
    setOptions({
      title: {
        text: type,
      },
      grid: {
        containLabel: true,
        left: 3,
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "time",
        splitLine: {
          show: false,
        },
        axisLabel: {
          hideOverlap: true,
        },
      },
      yAxis: {
        type: "value",
        scale: true,
        boundaryGap: [0, "10%"],
        min: 0,
        minInterval: 1,
        splitLine: {
          show: false,
        },
        axisLine: { onZero: true },
      },
      series: [
        {
          name: type,
          type: "line",
          showSymbol: false,
          data: valueArray,
        },
      ],
    });
  };

  if (type === "이산화탄소") valueRef.current = getData("co2");
  else if (type === "온도") valueRef.current = getData("temp");
  else if (type === "습도") valueRef.current = getData("humidity");
  else if (type === "거리센서") valueRef.current = getData("dist");

  const updateValue = () => {
    if (valueRef.current.value / 1 === 0) {
      setIsNodata(true);
      return;
    }

    setIsNodata(false);

    setValueArray((prevState) => {
      const newState = _.cloneDeep(prevState);
      const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
      newState.push({
        name: valueRef.current.time,
        value: [now, valueRef.current.value],
      });
      if (newState.length > 100) newState.shift();
      return newState;
    });
  };

  useEffect(() => {
    updateValue();
  }, [valueRef.current]);

  useEffect(() => {
    drawChart();
  }, [valueArray]);

  return (
    <div className="relative px-4 py-4 w-96 bg-white rounded-lg">
      <EChartsReact ref={chartInitRef} option={options} notMerge={true} />
      {isNodata && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center">
          <div className="flex-1 text-center font-bold text-4xl">No Data</div>
        </div>
      )}
    </div>
  );
};

export default LineChart;
