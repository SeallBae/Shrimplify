import React, { useEffect, useState } from "react";
import PondComponent from "../base/PondComponent";
import InformationBar from "../base/InformationBar";
import ShrimpButton from "../base/ShrimpButton";
import Weather from "../base/Weather";
import AddPond from "../form/AddPond";
import { AlertPopupModel } from "../../Model/alert";
import AlertPopup from "../base/AlertPopup";
import { useWeather } from "../../contexts/weather-context";

export interface Props {
  user: any;
  onChangeNav: Function;
}

export default function Home({ onChangeNav, user }: Props) {
  const { predictWeather } = useWeather();

  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertPopupModel | null>();

  useEffect(() => {
    if (predictWeather?.today?.isRainy) {
      setAlert({
        type: "danger",
        title:
          "Today is a rainy day! Prepare safety measures with your ponds and crops!",
      });
    }
  }, [predictWeather]);

  return (
    <>
      <div className="left-side">
        <PondComponent
          onChangeNav={onChangeNav}
          user={user}
        />
      </div>
      <div className="right-side">
        <InformationBar user={user} />
        <Weather />
        <Weather isPredict={true} />
      </div>
    </>
  );
}
