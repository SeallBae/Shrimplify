import React, { useEffect, useState } from "react";
import InformationBar from "../base/InformationBar";
import Weather from "../base/Weather";
import { useLocation } from "react-router-dom";
import { PondApi } from "../../Apis/pond.api";
import { Pond } from "../../Model/pond";
import CropComponent from "../base/CropComponent";

export interface Props {
  user: any;
}

export default function Manage({ user }: Props) {
  let location = useLocation();
  const [pond, setPond] = useState<Pond>();

  useEffect(() => {
    const pondId = location.pathname.split("/")[2];
    const promise = async () => {
      await PondApi.getPondById(pondId).then((data) => {
        setPond(data);
      });
    };
    promise();
  }, [location.pathname]);

  return (
    <>
      <div className="left-side">
        {pond ? (
          <>
            <div className="pond__name">Pond: {pond?.name}</div>
            <CropComponent pondId={pond.id} />
          </>
        ) : (
          <div className="pond__name">Choose pond!</div>
        )}
      </div>
      <div className="right-side">
        <InformationBar user={user} />
        <Weather />
        <Weather isPredict={true} />
      </div>
    </>
  );
}
