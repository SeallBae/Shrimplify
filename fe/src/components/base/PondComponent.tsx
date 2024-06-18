import React, { useEffect, useState } from "react";
import PondItem from "./PondItem";
import { PondApi } from "../../Apis/pond.api";
import { Pond } from "../../Model/pond";
import { useNavigate } from "react-router-dom";
import ShrimpButton from "./ShrimpButton";
import { AlertPopupModel } from "../../Model/alert";
import AddPond from "../form/AddPond";
import AlertPopup from "./AlertPopup";

export interface Props {
  user: any;
  onChangeNav: Function;
  reload?: boolean;
}

export default function PondComponent({ user, onChangeNav }: Props) {
  const [ponds, setPonds] = useState<Pond[]>();
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertPopupModel | null>();
  
  const navigate = useNavigate();

  useEffect(() => {
    PondApi.getPondsByUser(user?.name).then((result) => {
      setPonds(result);
    });
    if (isOpenForm) {
      setAlert(null);
    }
  }, [isOpenForm]);

  return (
    <>
    <div className="pond-container">
      <div className="title">Pond List</div>
      <ShrimpButton title={"Add pond"} onClick={() => setIsOpenForm(true)} />
      
      <div className="pond-list">
        {ponds &&
          ponds.map((pond, id) => {
            return <PondItem key={id} pond={pond} onChangeNav={onChangeNav} />;
          })}
      </div>
    </div>
    {isOpenForm && (
      <AddPond
        userName={user?.name}
        open={isOpenForm}
        setOpen={setIsOpenForm}
        setAlertPopup={setAlert}
      />
    )}
    {alert && <AlertPopup title={alert.title} type={alert.type} />}
    </>
  );
}

