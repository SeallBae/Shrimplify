import React, { useEffect, useState } from "react";
import StatComponent from "./StatComponent";
import CropInfo from "./CropInfo";
import ShrimpButton from "./ShrimpButton";
import { Crop } from "../../Model/crop";
import { CropApi } from "../../Apis/crop.api";
import { Stat } from "../../Model/stat";
import { StatApi } from "../../Apis/stat.api";
import AssignStats from "../form/AssignStats";
import ShowHistory from "../form/ShowHistory";
import WarningBox from "./WarningBox";
import { useNavigate } from "react-router-dom";
import { AlertPopupModel } from "../../Model/alert";
import AlertPopup from "./AlertPopup";
import { useWeather } from "../../contexts/weather-context";
import {
  ShrimpPredictorResponse,
  ShrimpQualityAttribute,
  shrimpQualityPredictor,
} from "../../utils/predictShrimp";

export interface Props {
  crop: Crop;
  pondId: string;
  setCrop: any;
}

export default function CropDetail({ crop, pondId, setCrop }: Props) {
  const navigate = useNavigate();

  const { predictWeather, currentWeather } = useWeather();

  const [statIds, setStatIds] = useState<string[]>();
  const [stats, setStats] = useState<Stat[]>();
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [isOpenHistory, setIsOpenHistory] = useState<boolean>(false);
  const [warning, setWarning] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertPopupModel | null>();
  const [isOpenPredict, setIsOpenPredict] = useState<boolean>(false);
  const [numberThreat, setNumberThreat] = useState<number>(0);
  const [predictWQI, setPredictWQI] = useState<number>();
  const [preventionScenarios, setPreventionScenarios] = useState<string[]>();
  const [risks, setRisks] = useState<ShrimpPredictorResponse>();
  const [currentAttribute, setCurrentAttribute] =
    useState<ShrimpQualityAttribute>();

  useEffect(() => {
    handlePredict();
  }, []);

  useEffect(() => {
    if (!isOpenForm) {
      setStatCrop();
    }
  }, [isOpenForm]);

  useEffect(() => {
    setStatCrop();
    StatApi.getAllStats().then((data) => {
      setStats(data);
    });
  }, [crop]);

  useEffect(() => {
    CropApi.getCropHistory(crop?.id).then((data) => {
      if (data.length > 0) {
        setAlert({
          type: "danger",
          title:
            "Please check your histories! There are some problem with your crop!",
        });
      }
    });
  }, []);

  const handlePredict = () => {
    CropApi.getCropHistoryByStat(1, crop?.id).then((data) => {
      
      if(typeof data === "string"){
        return
      }

      console.log(data);
      const threat = data?.filter(
        (d) => new Date().getDate() === new Date(d.history_date).getDate()
      );
      setNumberThreat(threat.length);

      const recentTemp = threat[threat.length - 1]?.num_stat;

      const temperature = recentTemp;
      const pH = 7.5;
      const dissolvedOxygen = 3;
      const nitrate = 10;
      const ammonia = 0.3;
      const salinity = 2000;
      const conductivity = 300;
      const turbidity = 3;

      const attributes: ShrimpQualityAttribute = {
        temperature,
        pH,
        dissolvedOxygen,
        nitrate,
        ammonia,
        salinity,
        conductivity,
        turbidity,
      };

      setCurrentAttribute(attributes);

      const risk = shrimpQualityPredictor.predictRisk(attributes);
      setRisks(risk);

      const preventionScenarios =
        shrimpQualityPredictor.proposePreventionScenarios(attributes);
      setPreventionScenarios(preventionScenarios);

      if (!preventionScenarios.length) {
        StatApi.getPredictWQI({
          pH,
          temp: temperature,
          do: dissolvedOxygen,
          conductivity,
          turbidity,
        }).then((data) => {
          setPredictWQI(+data);
        });
      } else {
        setPredictWQI(0);
      }
    });
  };

  const setStatCrop = () => {
    CropApi.getStatCrop(crop.id).then((data) => {
      if (data.length > 0) {
        const datas = data?.filter((s) => s.isActive === 1);
        setStatIds(datas.map((d) => d.statId));
      }
    });
  };

  const openWarning = () => {
    return (
      <WarningBox
        isOpen={warning}
        onClick={() => onDeleteCrop()}
        onCancel={() => setWarning(false)}
      />
    );
  };

  const onDeleteCrop = async () => {
    if (crop) {
      await CropApi.deleteCrop(crop?.id)
        .then(() => {
          setCrop(null);
          navigate("/crop/" + pondId);
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
      <CropInfo crop={crop} />
      <div className="" style={{ display: "flex" }}>
        <ShrimpButton
          title={"Assign stat"}
          onClick={() => setIsOpenForm(true)}
        />
        <ShrimpButton
          title={"View histories"}
          onClick={() => setIsOpenHistory(true)}
        />
        <ShrimpButton
          title={"Delete crop"}
          type="error"
          onClick={() => setWarning(true)}
        />
        <ShrimpButton
          title={"Open predict"}
          type="submit"
          onClick={() => setIsOpenPredict(true)}
        />
        <ShrimpButton
          title={"Back to crop list"}
          type="back"
          onClick={() => setCrop(null)}
        />
      </div>
      {statIds &&
        statIds?.map((statId, id) => {
          return <StatComponent key={id} statId={statId} crop={crop} />;
        })}
      {isOpenForm && (
        <AssignStats
          cropId={crop.id}
          open={isOpenForm}
          setOpen={setIsOpenForm}
        />
      )}
      {isOpenHistory && (
        <ShowHistory
          cropId={crop.id}
          open={isOpenHistory}
          setOpen={setIsOpenHistory}
        />
      )}
      {isOpenPredict ? (
        <div className="predict_risk">
          <div className="title">Predict & Scenerios</div>
          <hr />
          <div className="cropInfo-comtainer">
            <div className="content-list">
              <div className="content-item">
                pH: <strong>{currentAttribute?.pH}</strong>
              </div>
              <div className="content-item">
                temperature: <strong>{currentAttribute?.temperature}</strong>
              </div>
              <div className="content-item">
                dissolvedOxygen:{" "}
                <strong>{currentAttribute?.dissolvedOxygen}</strong>
              </div>
              <div className="content-item">
                ammonia: <strong>{currentAttribute?.ammonia}</strong>
              </div>
              <div className="content-item">
                conductivity: <strong>{currentAttribute?.conductivity}</strong>
              </div>
              <div className="content-item">
                nitrate: <strong>{currentAttribute?.nitrate}</strong>
              </div>
              <div className="content-item">
                turbidity: <strong>{currentAttribute?.turbidity}</strong>
              </div>
              <div className="content-item">
                salinity: <strong>{currentAttribute?.salinity}</strong>
              </div>
            </div>
          </div>
          <p>
            <strong>Predict WQI: {predictWQI ? "Good" : "Poor"}</strong>
          </p>
          <p className="threat">
            <strong>Today we have: {numberThreat} threats</strong>
          </p>
          <p>
            {risks?.high.split(":")[0]}{" "}
            <strong>{risks?.high.split(":")[1]}</strong>
          </p>
          <p>
            {risks?.low.split(":")[0]}{" "}
            <strong>{risks?.low.split(":")[1]}</strong>
          </p>
          <p>
            {risks?.normal.split(":")[0]}{" "}
            <strong>{risks?.normal.split(":")[1]}</strong>
          </p>
          <ul>
            <strong>Prevention Scenarios:</strong>
            {preventionScenarios?.map((p, i) => (
              <li key={i}>- {p}</li>
            ))}
          </ul>
          <ShrimpButton
            title={"Close"}
            type="submit"
            onClick={() => setIsOpenPredict(false)}
          />
        </div>
      ) : (
        ""
      )}
      {openWarning()}
      {alert && <AlertPopup title={alert.title} type={alert.type} />}
    </>
  );
}
