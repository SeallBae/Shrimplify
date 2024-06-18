import React, { useState, useEffect } from "react";
import moment from "moment";
import { useWeather } from "../../contexts/weather-context";

export interface Props {
  isPredict?: boolean;
}

export default function Weather({ isPredict }: Props) {
  const { predictWeather, currentWeather } = useWeather();
  const [isRainy, setIsRainy] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date());
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    if (isPredict) {
      setIsRainy(predictWeather?.tomorrow?.isRainy);
      setDate(new Date(predictWeather?.tomorrow?.time));
    } else {
      setIsRainy(predictWeather?.today?.isRainy);
      setDate(new Date(predictWeather?.today?.time));
    }
  }, [predictWeather]);

  return (
    <div className="rightside-container weather">
      <div className="rightside__title">
        {isPredict ? "Predict w" : "W"}eather
      </div>
      <div className="rightside__content">
        <div className="date">
          {weekday[date.getDay()]}, {moment(date).format("DD MMMM, YYYY")}
        </div>
        <div className="weather">
          Rain forecast today: <strong>{isRainy ? "Yes" : "No"}</strong>
        </div>
        <div className="weather">
          <strong>{isPredict ? "Start " : "Next "}</strong> raining at:{" "}
          <strong>{date.getHours() + ":00"}</strong>
        </div>
        {!isPredict && (
          <div className="temperature">
            Temperature: <strong>{currentWeather?.temperature}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
