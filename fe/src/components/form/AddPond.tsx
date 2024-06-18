import React, { useState } from "react";
import ShrimpButton from "../base/ShrimpButton";
import ShrimpInput from "../base/ShrimpInput";
import { FORM } from "../../containers/HomeContainer/HomeContainer";
import { PondApi } from "../../Apis/pond.api";
import { AlertPopupModel } from "../../Model/alert";
import AlertPopup from "../base/AlertPopup";

export interface Props extends FORM {
  id?: string;
  userName?: string;
}

export default function AddPond({
  id,
  userName,
  open,
  setOpen,
  setAlertPopup,
}: Props) {
  const [name, setName] = useState<string>();
  const [area, setArea] = useState<number>();
  const [deep, setDeep] = useState<number>();
  const [alert, setAlert] = useState<AlertPopupModel | null>();

  const onSave = () => {
    setAlert(null);
    if (name && area && deep) {
      const data = {
        userName,
        name,
        area,
        deep,
      };
      if (!id) {
        PondApi.createPond(data)
          .then(() => {
            setAlertPopup({
              type: "success",
              title: "Create success!",
            });
            setOpen(false);
          })
          .catch((errorMessage) => {
            setAlert({
              type: "danger",
              title: errorMessage,
            });
          });
      } else {
        PondApi.updatePond({ id, ...data })
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
        <form className="shrimpForm">
          <div className="form__title">Add new pond</div>
          <ShrimpInput title={"Name"} require={true} onInput={setName} />
          <ShrimpInput title={"Area"} require={true} onInput={setArea} />
          <ShrimpInput title={"Depth"} require={true} onInput={setDeep} />
          <div className="form__button">
            <ShrimpButton title={"Accept"} onClick={onSave} />
            <ShrimpButton title={"Cancel"} onClick={() => setOpen(false)} />
          </div>
        </form>
      </div>
      {alert && <AlertPopup title={alert.title} type={alert.type} />}
    </>
  );
}
