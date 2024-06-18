import React, { useEffect, useState } from "react";
import ShrimpButton from "../base/ShrimpButton";
import ShrimpInput from "../base/ShrimpInput";
import { CropApi } from "../../Apis/crop.api";
import { FORM } from "../../containers/HomeContainer/HomeContainer";
import { Stat } from "../../Model/stat";
import { StatApi } from "../../Apis/stat.api";
import socket from "../../utils/socket";
import { AlertPopupModel } from "../../Model/alert";
import AlertPopup from "../base/AlertPopup";

export interface Props extends FORM {
  id?: string;
  pondId?: string;
}

export default function AddCrop({
  id,
  pondId,
  open,
  setOpen,
  setAlertPopup,
}: Props) {
  const [type, setType] = useState<string>();
  const [population, setPopulation] = useState<number>();
  const [stats, setStats] = useState<Stat[]>();
  const [alert, setAlert] = useState<AlertPopupModel | null>();

  useEffect(() => {
    StatApi.getAllStats().then((result) => {
      setStats(result);
    });
  }, []);

  const onSave = () => {
    setAlert(null);
    if (type && population && pondId) {
      const data = {
        pondId,
        type,
        number: population,
      };
      if (!id) {
        CropApi.createCrop(data)
          .then((cropId) => {
            if (cropId && stats?.length) {
              CropApi.createStatCrop({
                id: cropId,
                lstStats: stats.map((s) => s.id).toString(),
                lstActive: stats.map((s) => 0).toString(),
              });
              socket.emit("create_tracking", cropId);
              setAlertPopup({
                type: "success",
                title: "Update success!",
              });
              setOpen(false);
            }
          })
          .catch((errorMessage) => {
            setAlert({
              type: "danger",
              title: errorMessage,
            });
          });
      } else {
        CropApi.updateCrop({ id, ...data })
          .then(() => {
            setAlertPopup({
              type: "success",
              title: "Update success!",
            });
            setOpen(false);
          })
          .catch((errorMessage) => {
            setAlert({
              type: "danger",
              title: errorMessage,
            });
          });
      }
    }
  };
  return (
    <>
      <div className={`form-container ${open ? "visible" : ""}`}>
        <form className="shrimpForm" action="">
          <div className="form__title">Add new crop</div>
          <ShrimpInput title={"Type"} require={true} onInput={setType} />
          <ShrimpInput
            title={"Population"}
            require={true}
            onInput={setPopulation}
          />
          <div className="form__button">
            <ShrimpButton title={"Accept"} onClick={onSave} />
            <ShrimpButton title={"cancel"} onClick={() => setOpen(false)} />
          </div>
        </form>
      </div>
      {alert && <AlertPopup title={alert.title} type={alert.type} />}
    </>
  );
}
