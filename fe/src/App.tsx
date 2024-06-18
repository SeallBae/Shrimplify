import React, { useState, useEffect } from "react";
import HomeContainer from "./containers/HomeContainer/HomeContainer";
import "./App.scss";
import LoginContainer from "./containers/LoginContainer/LoginContainer";
import { Route, Routes } from "react-router-dom";
import { User } from "./Model/user";
import { apiAxios } from "./utils/axios";
import { CropApi } from "./Apis/crop.api";
import socket from "./utils/socket";
import { WeatherProvider } from "./contexts/weather-context";

export const MENU: any = {
  HOME: "HOME",
  MANAGE: "MANAGE",
  SETTING: "SETTING",
  GENERAL: "GENERAL"
};

export default function App() {
  const [user, setUser] = useState<User | undefined>();

  useEffect(() => {
    if (!user) {
      const name = localStorage.getItem("name");
      const access_token = localStorage.getItem("access_token");
      const refresh_token = localStorage.getItem("refresh_token");
      const is_admin = localStorage.getItem("is_admin");
      if (name && access_token && refresh_token && is_admin) {
        const user: User = {
          name: name,
          access_token: access_token,
          refresh_token: refresh_token,
          isAdmin: !!+is_admin,
        };
        setUser(user);
      }
    }

    const initTrackingData = async () => {
      if (user) {
        await CropApi.getAllTrackingCropsByPondId(user?.name, 1).then(
          (data) => {
            socket.emit(
              "init_tracking",
              data.map((d) => d.id)
            );
          }
        );
      }
    };
    initTrackingData();
  }, [user]);

  const onSetUser = (data: User) => {
    if (data) {
      localStorage.setItem("name", data.name);
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("is_admin", data.isAdmin.toString());
      apiAxios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.access_token}`;

      setUser(data);
    } else {
      setUser(undefined);
    }
  };

  return (
    <WeatherProvider>
      <Routes>
        {user ? (
          <>
            <Route
              path="/"
              element={
                <HomeContainer
                  user={user}
                  onSetUser={onSetUser}
                  navigate={MENU.HOME}
                />
              }
            />
            <Route
              path="/crop/:pondId"
              element={
                <HomeContainer
                  user={user}
                  onSetUser={onSetUser}
                  navigate={MENU.MANAGE}
                />
              }
            />
            <Route
              path="/setting"
              element={
                <HomeContainer
                  user={user}
                  onSetUser={onSetUser}
                  navigate={MENU.SETTING}
                />
              }
            />
            <Route
              path="/general"
              element={
                <HomeContainer
                  user={user}
                  onSetUser={onSetUser}
                  navigate={MENU.GENERAL}
                />
              }
            />
          </>
        ) : (
          <Route path="/*" element={<LoginContainer onSetUser={onSetUser} />} />
        )}
      </Routes>
    </WeatherProvider>
  );
}
