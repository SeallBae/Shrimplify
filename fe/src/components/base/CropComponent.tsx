import React, { useEffect, useState } from "react";
import CropItem from "./CropItem";
import ShrimpButton from "./ShrimpButton";
import CropDetail from "./CropDetail";
import { Crop } from "../../Model/crop";
import AddCrop from "../form/AddCrop";
import { CropApi } from "../../Apis/crop.api";
import WarningBox from "./WarningBox";
import { useNavigate } from "react-router-dom";
import { PondApi } from "../../Apis/pond.api";
import { AlertPopupModel } from "../../Model/alert";
import AlertPopup from "./AlertPopup";

export interface Props {
  pondId: string;
}

export default function CropComponent({ pondId }: Props) {
  const navigate = useNavigate();

  const [crops, setCrops] = useState<Crop[]>();
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [crop, setCrop] = useState<Crop | null>();
  const [warning, setWarning] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertPopupModel | null>();

  useEffect(() => {
    CropApi.getAllCropsByPondId(pondId).then((data) => {
      setCrops(data);
    });
    if (isOpenForm) {
      setAlert(null);
    }
  }, [isOpenForm]);

  useEffect(() => {
    CropApi.getAllCropsByPondId(pondId).then((data) => {
      setCrops(data);
    });
  }, [crop]);

  const openWarning = () => {
    return (
      <WarningBox
        isOpen={warning}
        onClick={() => onDeletePond()}
        onCancel={() => setWarning(false)}
      />
    );
  };

  const onDeletePond = async () => {
    setAlert(null);
    if (pondId) {
      await PondApi.deletePond(pondId)
        .then(() => {
          navigate("/");
        })
        .catch((errorMessage) => {
          setAlert({
            type: "danger",
            title: errorMessage,
          });
        });
    }
  };

  return (
    <>
      {crop ? (
        <CropDetail crop={crop} pondId={pondId} setCrop={setCrop} />
      ) : (
        <div className="crop-container">
          <div className="title">
            <div className="left-group">
              Crop List
              <ShrimpButton
              title={"Back to pond list"}
              type="back"
              onClick={() => navigate(`/`)}
            />
            </div>   
            <ShrimpButton
              title={"Delete pond"}
              type="error"
              onClick={() => setWarning(true)}
            />
          </div>
          <ShrimpButton
            title={"add crop"}
            onClick={() => setIsOpenForm(true)}
          />
          <div className="crop-list">
            {crops &&
              crops.map((crop, id) => {
                return <CropItem key={id} crop={crop} onClick={setCrop} />;
              })}
          </div>
        </div>
      )}
      {isOpenForm && (
        <AddCrop
          pondId={pondId}
          open={isOpenForm}
          setOpen={setIsOpenForm}
          setAlertPopup={setAlert}
        />
      )}
      {openWarning()}
      {alert && <AlertPopup title={alert.title} type={alert.type} />}
    </>
  );
}
