import React, { useEffect, useState } from "react";
import ShrimpButton from "../base/ShrimpButton";
import moment from "moment";
import { History } from "../../Model/history";
import { CropApi } from "../../Apis/crop.api";
import { FORM } from "../../containers/HomeContainer/HomeContainer";
import { OrderStat } from "../../enum/shrimp-stat";
import { Stat } from "../../Model/stat";
import { StatApi } from "../../Apis/stat.api";

export interface Props extends FORM {
  cropId: string;
}

export default function ShowHistory({ cropId, open, setOpen }: Props) {
  const [histories, setHistories] = useState<History[]>();
  const [stats, setStats] = useState<Stat[]>();
  const [selectedStat, setSelectedStat] = useState<number>(1);

  useEffect(() => {
    StatApi.getAllStats().then((data) => {
      console.log("allstat" + data);
      setStats(data);
    });
  }, []);

  useEffect(() => {
    CropApi.getCropHistoryByStat(selectedStat, cropId).then((data) => {
      if (data.length) {
        setHistories(data);
      }
    });
  }, [cropId, selectedStat]);

  return (
    <div className={`form-container history ${open ? "visible" : ""}`}>
      <div className="shrimpForm">
        <div className="form__title">
          Histories (Danger)
          <ShrimpButton
            title={"Close"}
            onClick={() => setOpen(false)}
            type="error"
          />
        </div>
        <div className="form__button">
          {stats?.length &&
            stats.map((stat) => (
              <ShrimpButton
                key={stat.id}
                title={stat.name}
                onClick={() => {
                  setSelectedStat(+stat.id);
                }}
                type={+stat.id === +selectedStat ? "submit" : "outlined"}
              />
            ))}
        </div>
        <div className="history-container">
          {Array.isArray(histories) &&
            histories.map((history: History, id: any) => {
              return (
                <div key={id} className="history-item">
                  <div className="date">
                    Date:{" "}
                    {moment(history.history_date).format("DD-MM-YYYY HH:mm:ss")}
                  </div>
                  <div className="type">
                    Type:{" "}
                    <strong>
                      <i>{OrderStat[+history.statId]}</i>
                    </strong>
                  </div>
                  <div className="number">
                    Index:{" "}
                    <strong>
                      <i>{+history.num_stat}</i>
                    </strong>
                  </div>
                  <div className="desc">
                    Description:{" "}
                    <strong>
                      <i>{history.description}</i>
                    </strong>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
