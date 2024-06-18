import React, { useEffect, useState } from "react";
import { ChartData, ScatterDataPoint } from "chart.js";
import LineChart from "./LineChart";
import moment from "moment";
import { CropApi } from "../../Apis/crop.api";
import { CreateHistory } from "../../Model/history";
import { StatApi } from "../../Apis/stat.api";
import { Stat } from "../../Model/stat";
import { Crop, CropStat } from "../../Model/crop";
import ShrimpButton from "./ShrimpButton";
import socket from "../../utils/socket";
import { randomData } from "../../utils/common-helper";
import { OrderStat, StatEffect } from "../../enum/shrimp-stat";

export interface Props {
  statId: string;
  crop: Crop;
}

export default function StatComponent({ statId, crop }: Props) {
  const [stat, setStat] = useState<Stat[]>();
  const [statCrop, setStatCrop] = useState<CropStat>();
  const [labels, setLabels] = useState<any[]>([]);
  const [datas, setDatas] = useState<number[]>([]);
  const [borderColor, setBorderColor] = useState<string[]>([]);
  const [currentStat, setCurrentStat] = useState<number>(0.0);
  const [iotId, setIotId] = useState<number>();

  // useEffect(() => {
  //   socket.emit("get_port_list");
  //   socket.emit("FE_TRACKING_BY_CROP", crop?.id);
  // }, []);

  useEffect(() => {
    StatApi.getStatById(statId).then((data) => {
      data.length && setStat(data);
    });
    CropApi.getStatCrop(crop?.id).then((data) => {
      setStatCrop(data?.find((d) => d.statId === statId));
      if(statCrop?.iotId) {
        socket.emit("FE_TRACKING_BY_CROP", crop?.id);
      }
    });
  }, [statId]);

  // useEffect(() => {
  //   const intervalPH = setInterval(() => {
  //     if (Array.isArray(stat) && stat.length > 0) {
  //       const chartData: number[] = [...datas];
  //       const timeData: any[] = [...labels];
  //       const colorData: string[] = [...borderColor];

  //       if (chartData.length > 8) {
  //         chartData.shift();
  //         timeData.shift();
  //         colorData.shift();
  //       }
  //       var time = moment().format("LT");
  //       var data: number = parseFloat(
  //         randomData(stat[0].from_stat - 2, stat[0].to_stat + 2, currentStat)
  //       );
  //       setCurrentStat(data);

  //       if (data < stat[0].from_stat || data > stat[0].to_stat) {
  //         colorData.push("#FF0000");
  //       } else {
  //         colorData.push("#1BFF00");
  //       }
  //       setBorderColor(colorData);

  //       chartData.push(data);
  //       setDatas(chartData);

  //       timeData.push(time);
  //       setLabels(timeData);
  //     } else {
  //       clearInterval(intervalPH);
  //     }
  //   }, period);

  //   return () => {
  //     clearInterval(intervalPH);
  //   };
  // }, [datas, labels, borderColor, stat, period]);

  const connectIoTDevice = () => {
    if (iotId) {
      CropApi.connectIoTDevice({ id: crop.id, statId: +statId, iotId }).then(
        () => {
          CropApi.getStatCrop(crop?.id).then((data) => {
            setStatCrop(data?.find((d) => d.statId === statId));
          });
          socket.emit("FE_TRACKING_BY_CROP", crop?.id);
        }
      );
    }
  };

  useEffect(() => {
    if (Array.isArray(stat) && stat.length) {
      socket.on(`${stat[0].name}_${crop?.id}`, (data) => {
        const chartData: number[] = [...datas];
        const timeData: any[] = [...labels];
        const colorData: string[] = [...borderColor];

        if (chartData.length > 8) {
          chartData.shift();
          timeData.shift();
          colorData.shift();
        }
        var time = moment().format("LT");
        var dataRecieve: number = data;
        console.log(dataRecieve);
        setCurrentStat(dataRecieve);

        if (dataRecieve < stat[0].from_stat || dataRecieve > stat[0].to_stat) {
          colorData.push("#FF0000");
        } else {
          colorData.push("#1BFF00");
        }
        setBorderColor(colorData);

        chartData.push(dataRecieve);
        setDatas(chartData);

        timeData.push(time);
        setLabels(timeData);
      });
    }
  }, [datas, labels, borderColor, stat]);

  useEffect(() => {
    const min = stat?.length && stat[0]?.from_stat;
    const max = stat?.length && stat[0]?.to_stat;
    let description = "";
    if (min && max && stat[0]) {
      const id: number = +stat[0].id;
      const type = OrderStat[id] as keyof typeof StatEffect;
      if (currentStat < min) {
        description += `Your ${stat[0].name} is lower than normal! Please check ${StatEffect[type]}!`;
      } else if (currentStat > max) {
        description += `Your ${stat[0].name} is higher than normal! Please check ${StatEffect[type]}!`;
      }

      if (currentStat < min || currentStat > max) {
        const history: CreateHistory = {
          cropId: crop.id,
          statId: statId,
          isDanger: true,
          num_stat: currentStat,
          description: description,
        };

        CropApi.createCropHistory(history);
      }
    }
  }, [datas]);

  const data: ChartData<"line", (number | ScatterDataPoint | null)[], unknown> =
    {
      labels: labels,
      datasets: [
        {
          label: stat && stat.length ? stat[0].name + ": " : "",
          data: datas,
          backgroundColor: borderColor,
          borderColor: "#3e95cd",
          pointRadius: 5,
        },
      ],
    };

  const options: any = {
    scales: {
      x: {
        title: {
          color: "black",
          display: true,
          text: "Time (Hours)",
          font: {
            size: 16,
          },
        },
      },
      y: {
        title: {
          color: "black",
          display: true,
          text: stat?.length && stat[0]?.name,
          font: {
            size: 16,
          },
        },
      },
    },
  };

  return (
    <div className="stat-container">
      <div className="stat__name">
        {stat?.length && stat[0]?.name}: Current: {datas[datas.length - 1]}
      </div>
      {!statCrop?.iotId ? (
        <div className="periodField">
          <div className="shrimpInput">
            <div className="input__title">Enter iot ID:</div>
            <input
              type="number"
              onChange={(e) => setIotId(parseInt(e.target.value))}
            />
          </div>
          <ShrimpButton title="Accept" onClick={() => connectIoTDevice()} />
        </div>
      ) : (
        `Connected to IOT ${statCrop.iotId}`
      )}
      <br />
      <br />
      <div className="stat-chart">
        <LineChart data={data} options={options} />
      </div>
    </div>
  );
}
