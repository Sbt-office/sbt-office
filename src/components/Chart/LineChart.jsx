import React, { useEffect, useRef, useState } from "react";
import EChartsReact from "echarts-for-react";
import _ from "lodash";
import useSocketStore from "../../store/socketStore";
import dayjs from "dayjs";

const LineChart = ({ title, type }) => {
  const { getData } = useSocketStore();

  const chartInitRef = useRef();
  const valueRef = useRef(getData(type));

  const [options, setOptions] = useState({});
  const [valueArray, setValueArray] = useState([]);
  const [isNodata, setIsNodata] = useState(false);

  const drawChart = () => {
    setOptions({
      title: {
        text: title,
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
          name: title,
          type: "line",
          showSymbol: false,
          data: valueArray,
        },
      ],
    });
  };

  const updateValue = () => {
    if (valueRef.current.value / 1 === 0) {
      setIsNodata(true);
      return;
    }

    setIsNodata(false);

    setValueArray((prevState) => {
      const newState = _.cloneDeep(prevState);
      newState.push({
        name: valueRef.current.time,
        value: [valueRef.current.time, valueRef.current.value],
      });
      if (newState.length > 100) newState.shift();
      return newState;
    });
  };

  useEffect(() => {
    if (valueRef.current) updateValue();
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
