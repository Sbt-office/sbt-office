import React, { useEffect, useRef, useState } from "react";
import EChartsReact from "echarts-for-react";
import _ from "lodash";
import useSocketStore from "../../store/socketStore";
import dayjs from "dayjs";

const LineChart = ({ type }) => {
  const { co2, temp, humidity, dist } = useSocketStore();

  const chartInitRef = useRef();
  const itvRef = useRef();
  const valueRef = useRef(0);

  const [options, setOptions] = useState({});
  const [valueArray, setValueArray] = useState([]);

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
        axisLabel: {
          hideOverlap: true,
        },
        axisPointer: {
          animation: false,
        },
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

  if (type === "이산화탄소") valueRef.current = co2;
  else if (type === "온도") valueRef.current = temp;
  else if (type === "습도") valueRef.current = humidity;
  else if (type === "거리센서") valueRef.current = dist;

  const updateValue = () => {
    if (valueRef.current / 1 === 0) return;
    setValueArray((prevState) => {
      const newState = _.cloneDeep(prevState);
      const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
      newState.push({
        name: now,
        value: [now, valueRef.current],
      });
      if (newState.length > 100) newState.shift();
      return newState;
    });
  };

  useEffect(() => {
    updateValue();
    itvRef.current = setInterval(updateValue, 1000);

    return () => {
      clearInterval(itvRef.current);
    };
  }, []);

  useEffect(() => {
    drawChart();
  }, [valueArray]);

  return (
    <div className="px-4 py-4 w-96 bg-white rounded-lg">
      <EChartsReact ref={chartInitRef} option={options} notMerge={true} />
    </div>
  );
};

export default LineChart;
