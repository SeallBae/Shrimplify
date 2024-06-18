import React, { useState, useEffect } from "react";
import ShrimpButton from "../base/ShrimpButton";
import ShrimpCheckbox from "../base/ShrimpCheckbox";
import { Stat } from "../../Model/stat";
import { StatApi } from "../../Apis/stat.api";
import { CropApi } from "../../Apis/crop.api";
import { FORM } from "../../containers/HomeContainer/HomeContainer";
import { CropStat } from "../../Model/crop";

export interface Props extends FORM {
  cropId: string;
}

export default function AssignStats({ cropId, open, setOpen }: Props) {
  const [stats, setStats] = useState<Stat[]>();
  const [statIds, setStatIds] = useState<CropStat[]>();

  useEffect(() => {
    StatApi.getAllStats().then((result) => {
      setStats(result);
    });
    updateCropStat();
  }, []);

  const updateCropStat = () => {
    CropApi.getStatCrop(cropId).then((result) => {
      console.log(result);
      
      setStatIds(result);
    });
  };

  const onChangeCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    const value = e.target.value;
    CropApi.updateStatCrop({
      id: cropId,
      statId: value,
      isActive:
        statIds?.length &&
        statIds?.find((s) => s.statId === value)?.isActive === 0
          ? 1
          : 0,
    }).then(() => {
      updateCropStat();
    });
  };

  return (
    <div className={`form-container ${open ? "visible" : ""}`}>
      <form className="shrimpForm" action="">
        <div className="form__title">Assign stats</div>
        <ShrimpCheckbox
          items={stats}
          checkedItems={statIds}
          onChange={onChangeCheckBox}
        />
        <div className="form__button">
          <ShrimpButton title={"cancel"} onClick={() => setOpen(false)} />
        </div>
      </form>
    </div>
  );
}
