import React, { useEffect, useState } from "react";
import moment from "moment";
import { Crop } from "../../Model/crop";

export interface Props {
  crop: Crop;
}

export default function CropInfo({ crop }: Props) {
  const [info, setInfo] = useState<Crop>();

  useEffect(() => {
    setInfo(crop);
  }, [crop]);

  return (
    <div className="cropInfo-container">
      <div className="title">Information of crop:</div>
      <div className="content-list">
        <div className="content-item">
          <strong>Type</strong>: {info?.type}
        </div>
        <div className="content-item">
          <strong>Population</strong>: {info?.number}
        </div>
        <div className="content-item">
          <strong>Start</strong>: {moment(info?.startDate).format("DD-MM-YYYY")}
        </div>
      </div>
    </div>
  );
}
