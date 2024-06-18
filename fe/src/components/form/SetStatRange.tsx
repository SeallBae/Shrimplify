import React, { useState, useEffect } from "react";
import ShrimpButton from "../base/ShrimpButton";
import ShrimpInput from "../base/ShrimpInput";
import ShrimpSelect from "../base/ShrimpSelect";
import { Stat } from "../../Model/stat";
import { StatApi } from "../../Apis/stat.api";
import { FORM } from "../../containers/HomeContainer/HomeContainer";
import AlertPopup from "../base/AlertPopup";
import { AlertPopupModel } from "../../Model/alert";

export interface Props extends FORM {
  user: any;
}

export default function SetStatRange({ user, open, setOpen }: Props) {
  const [stats, setStats] = useState<Stat[]>([]);
  const [currentStat, setCurrentStat] = useState<Stat>();
  const [id, setId] = useState<number>();
  const [statFrom, setStatFrom] = useState<number>();
  const [statTo, setStatTo] = useState<number>();
  const [alert, setAlert] = useState<AlertPopupModel | null>();

  useEffect(() => {
    StatApi.getAllStats().then((result) => {
      setStats(result);
      setStatInfo(result[0]);
    });
  }, []);

  const onSave = () => {
    if (statFrom && statTo && id) { 
      const data: Stat = {
        id,
        from_stat: statFrom,
        to_stat: statTo,
        userName: user?.name,
      };
      StatApi.updateStat(data)
        .then((data) => {
          console.log("data: "+ data);
          
          setOpen(false);
        })
        .catch((errorMessage) => {
          console.log("errorMessage: "+errorMessage);
          
          setAlert({
            type: "danger",
            title: errorMessage,
          });
        });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const stat = stats.find((s) => +s.id === +value);
    stat && setStatInfo(stat);
  };

  const setStatInfo = (stat: Stat) => {
    setCurrentStat(stat);
    setId(stat?.id);
    setStatFrom(stat?.from_stat);
    setStatTo(stat?.to_stat);
  };

  return (
    <div className={`form-container ${open ? "visible" : ""}`}>
      <form className="shrimpForm" action="">
        <div className="form__title">Set stat range</div>
        <ShrimpSelect onChange={handleChange} items={stats} />
        <ShrimpInput
          title={"Min stat"}
          require={true}
          onInput={setStatFrom}
          value={statFrom || 0}
        />
        <ShrimpInput
          title={"Max stat"}
          require={true}
          onInput={setStatTo}
          value={statTo || 0}
        />
        <div className="form__button">
          <ShrimpButton title={"Accept"} onClick={onSave} />
          <ShrimpButton title={"cancel"} onClick={() => setOpen(false)} />
        </div>
      </form>
      {alert && <AlertPopup title={alert.title} type={alert.type} />}
    </div>
  );
}
