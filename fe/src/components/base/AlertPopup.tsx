import React, { useState } from "react";

export interface Props {
  title: string;
  type?: "warning" | "success" | "danger";
  auto?: boolean;
}

export default function AlertPopup({
  title,
  type = "success",
  auto = false,
}: Props) {
  const [show, setShow] = useState<boolean>(true);

  return (
    <div
      className={`alert ${type} ${show ? "show" : ""} ${auto ? "auto" : ""}`}
      role="alert"
    >
      <strong>{type.toUpperCase()}!&nbsp;</strong>
      {title}
      {!auto && (
        <button type="button" className="close" onClick={() => setShow(false)}>
          <span aria-hidden="true">&times;</span>
        </button>
      )}
    </div>
  );
}
