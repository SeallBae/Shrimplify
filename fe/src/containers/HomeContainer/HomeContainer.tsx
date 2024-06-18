import React, { useEffect, useState } from "react";
import Header from "../../components/base/Header";
import Navigation from "../../components/base/Navigation";
import Home from "../../components/pages/Home";
import Manage from "../../components/pages/Manage";
import Setting from "../../components/pages/Setting";
import { MENU } from "../../App";
import { AuthApi } from "../../Apis/auth.api";
import General from "../../components/pages/General";

export interface Props {
  user: any;
  onSetUser: Function;
  navigate: string;
}

export interface FORM {
  open?: any;
  setOpen?: any;
  setAlertPopup?: any;
}

export default function HomeContainer({ user, onSetUser, navigate }: Props) {
  const [menuItem, setMenuItem] = useState<string>("home");

  useEffect(() => {
    setMenuItem(navigate);
  }, [navigate]);

  const onChangeNav = (nav: string, id?: string) => {
    setMenuItem(nav);
  };

  const onLogout = async () => {
    AuthApi.logout()
      .then(() => {
        onSetUser(null);
      })
      .catch((e) => {
        console.log("error");
      });
  };

  return (
    <div className="home-container">
      <Navigation
        user={user}
        menuItem={menuItem}
        onChangeNav={onChangeNav}
        onLogout={onLogout}
      />
      <div className={`main-container`}>
        <Header user={user} />
        <div className="content-container">
          {menuItem === MENU.HOME && (
            <Home user={user} onChangeNav={onChangeNav} />
          )}
          {menuItem === MENU.MANAGE && <Manage user={user} />}
          {menuItem === MENU.SETTING && <Setting user={user} />}
          {menuItem === MENU.GENERAL && <General user={user} />}
        </div>
      </div>
    </div>
  );
}
