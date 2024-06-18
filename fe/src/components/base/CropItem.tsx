import React from "react";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getDiffDate } from "../../utils/common-helper";
import { Crop } from "../../Model/crop";

export interface Props {
  crop: Crop;
  onClick?: any;
}

export default function CropItem({ crop, onClick }: Props) {
  return (
    <div className="crop-item" onClick={() => onClick(crop)}>
      <div className="content">Type: {crop.type}</div>
      <div className="content">Population: {crop.number}</div>
      <div className="content">Last modified: {getDiffDate(crop.startDate)}</div>
      <div className="link">
        Go to detail
        <FontAwesomeIcon icon={solid("chevron-right")} />
      </div>
    </div>
  );
}
