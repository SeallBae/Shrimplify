import React, {
  ReactNode,
  createContext,
  useEffect,
  useState,
  useContext,
} from "react";
import { WeatherApi } from "../Apis/weather";
import { handlePredictWeather } from "../utils/predictWeather";

interface WeatherState {
  predictWeather?: any;
  setPredictWeather?: React.Dispatch<React.SetStateAction<any>>;
  currentWeather?: any;
  setCurrentWeather?: React.Dispatch<React.SetStateAction<any>>;
}

const initialState: WeatherState = {
  predictWeather: undefined,
  setPredictWeather: () => {},
  currentWeather: undefined,
  setCurrentWeather: () => {},
};

const WeatherContext = createContext(initialState);

const useWeather = () => useContext(WeatherContext);

const WeatherProvider = ({ children }: { children: ReactNode }) => {
  const [predictWeather, setPredictWeather] = useState<any>({});
  const [currentWeather, setCurrentWeather] = useState<any>();

  useEffect(() => {
    console.log("heelo");
    
    navigator.geolocation.getCurrentPosition(async (position) => {
      console.log(position);
      
      const weather = await WeatherApi.getWeather(
        position.coords.latitude,
        position.coords.longitude
      );
      console.log(weather);
      
      setCurrentWeather(weather?.current_weather);
      setPredictWeather(
        handlePredictWeather(
          weather?.hourly?.time,
          weather?.hourly?.weathercode
        )
      );
    });
  }, []);

  return (
    <WeatherContext.Provider
      value={{
        predictWeather,
        setPredictWeather,
        currentWeather,
        setCurrentWeather,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export { WeatherContext, useWeather, WeatherProvider };
