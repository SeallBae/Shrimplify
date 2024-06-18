import React from "react";
import ShrimpButton from "./ShrimpButton";

export interface Props {
  isOpen?: boolean;
  onClick: any;
  onCancel: any;
}

export default function WarningBox({ onClick, isOpen, onCancel }: Props) {
  return (
    <div className={`warning-box ${isOpen ? "show" : ""}`}>
      <div className="content">
        Are you sure to delete this item(s)?
        <div className="btn-container">
          <ShrimpButton
            title={"Accept"}
            type="error"
            onClick={onClick}
          ></ShrimpButton>
          <ShrimpButton
            title={"Cancel"}
            type="cancel"
            onClick={onCancel}
          ></ShrimpButton>
        </div>
      </div>
    </div>
  );
}
