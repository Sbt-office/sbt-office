import { useEffect, useRef, useState } from "react";
import useSocketStore from "../../store/socketStore";
import EChartsReact from "echarts-for-react";

const GaugeChart = ({ title, type, min = 0, max = 100, range = [], unit }) => {
  const { getData } = useSocketStore();

  const chartInitRef = useRef();
  const valueRef = useRef({});

  const [options, setOptions] = useState({});

  valueRef.current = getData(type);

  const drawChart = () => {
    const color = [];
    const colorList = ["#00BFFF", "#7CFC00", "#FFD700"];
    range.map((value, idx) => {
      color.push([(value - min) / max, colorList[idx]]);
    });
    color.push([1, "#FF4500"]);

    setOptions({
      title: {
        text: title,
      },
      series: [
        {
          type: "gauge",
          center: ["50%", "65%"],
          axisLine: {
            lineStyle: {
              width: 15,
              color: color,
            },
          },
          startAngle: 180,
          endAngle: 0,
          min: min,
          max: max,
          splitNumber: 10,
          pointer: {
            itemStyle: {
              color: "auto",
            },
          },
          axisTick: {
            distance: -15,
            length: 6,
            lineStyle: {
              color: "#fff",
              width: 2,
            },
          },
          splitLine: {
            distance: -15,
            length: 10,
            lineStyle: {
              color: "#fff",
              width: 4,
            },
          },
          axisLabel: {
            color: "inherit",
            distance: 27,
            fontSize: 15,
          },
          detail: {
            valueAnimation: true,
            formatter: "{value} " + unit,
            color: "inherit",
            fontSize: 20,
          },
          data: [
            {
              value: valueRef.current.value,
            },
          ],
        },
      ],
    });
  };

  useEffect(() => {
    drawChart();
  }, [valueRef.current]);

  return (
    <div className="relative px-4 py-4 w-96 bg-white rounded-lg">
      <EChartsReact ref={chartInitRef} option={options} notMerge={true} />
    </div>
  );
};

export default GaugeChart;
