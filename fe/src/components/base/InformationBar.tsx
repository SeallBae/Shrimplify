import React, { useState, useEffect } from "react";
import { PondApi } from "../../Apis/pond.api";

export interface Props {
  user?: any;
}

export default function InformationBar({ user }: Props) {
  const [ponds, setPonds] = useState(0);
  const [area, setArea] = useState(0);

  useEffect(() => {
    PondApi.getPondsByUser(user?.name).then((data) => {
      var totalArea = data.reduce(function (acc: number, pond: any) {
        return acc + pond.area;
      }, 0);
      setPonds(data.length);
      setArea(totalArea);
    });
  }, []);

  return (
    <div className="rightside-container">
      <div className="rightside__title">Overall indices</div>
      <div className="rightside__content">
        <div className="info-bar__item">Total ponds: {ponds}</div>
        <div className="info-bar__item">
          Total area: {area} km<sup>2</sup>
        </div>
      </div>
    </div>
  );
}
