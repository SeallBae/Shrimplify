import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import MenuItem from "./MenuItem";
import { MENU } from "../../App";
import { useNavigate } from "react-router-dom";
import { AlertPopupModel } from "../../Model/alert";
import AlertPopup from "./AlertPopup";

export interface Props {
  onChangeNav: Function;
  menuItem: string;
  user: any;
  onLogout: Function;
}

export default function Navigation({ onChangeNav, menuItem, onLogout }: Props) {
  const [alert, setAlert] = useState<AlertPopupModel | null>();

  useEffect(() => {
    if (alert) {
      setTimeout(() => {
        setAlert(null);
      }, 3000);
    }
  }, [alert]);

  const navigate = useNavigate();
  return (
    <>
      <div className="navigation-container">
        <div className="logo-container">
          <div className="logo-image">
            <FontAwesomeIcon icon={solid("shrimp")} />
          </div>
        </div>
        <MenuItem
          title={"Home"}
          icon={<FontAwesomeIcon icon={solid("home")} />}
          nav={MENU.HOME}
          onClick={() => navigate("/")}
          isActive={menuItem === MENU.HOME}
        />
        <MenuItem
          title={"Manage"}
          icon={<FontAwesomeIcon icon={solid("list")} />}
          nav={MENU.MANAGE}
          onClick={() => {
            setAlert({
              type: "warning",
              title: "Select pond first!",
            });
            navigate("/");
          }}
          isActive={menuItem === MENU.MANAGE}
        />
        <MenuItem
          title={"Setting"}
          icon={<FontAwesomeIcon icon={solid("gear")} />}
          nav={MENU.SETTING}
          onClick={() => navigate("/setting")}
          isActive={menuItem === MENU.SETTING}
        />
        <MenuItem
          title={"General"}
          icon={<FontAwesomeIcon icon={solid("layer-group")} />}
          nav={MENU.SETTING}
          onClick={() => navigate("/general")}
          isActive={menuItem === MENU.GENERAL}
        />
        <button
          className="logout-btn"
          onClick={async () => {
            onLogout();
          }}
        >
          Logout
        </button>
      </div>
      {alert && (
        <AlertPopup title={alert.title} type={alert.type} auto={true} />
      )}
    </>
  );
}
